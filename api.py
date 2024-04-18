from flask import Flask, request
from flask_cors import CORS, cross_origin
import pandas as pd
import json
import psycopg2
import pandas.io.sql as psql

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#Preencher com os parametros do database do elephantsql
db_params = {
    'host': 'kesavan.db.elephantsql.com',
    'database': 'umltvftk',
    'user': 'umltvftk',
    'password': '6MHS_p2qH5sOt902ziUGM-mooye42ulG'
}

#Criando conexão
conn = psycopg2.connect(
    host=db_params['host'],
    database=db_params['database'],
    user=db_params['user'],
    password=db_params['password']
)

# Create um cursor (o que vai fazer os comandos sql)
cur = conn.cursor()

# faz commitar automaticamente pra não precisar ficar chamando conn.commit apos cada mudança nos dados
conn.set_session(autocommit=True)

def filtrarPorCursoTurno(idCurso, turno, paramCampus):
    jaCursadas = "'Bases Matemáticas', 'Álgebra Linear', 'Funções de Várias Variáveis', 'Segurança de Dados'" #vetor jaCursadas o aluno ja cursou
    apresentarFinal = f'''
        (SELECT DISTINCT t1."Disciplina", t1."Sigla" 
        FROM "public"."Disciplinas_No_PDF" t1
        JOIN "public"."Grade curso" t2 ON t2."Sigla" LIKE CONCAT('%', t1."Sigla", '%') WHERE t2."idCurso" = {idCurso} AND t1."Disciplina" NOT IN ({jaCursadas}));
        '''.format(idCurso, jaCursadas)
    disciplinasCurso = psql.read_sql(apresentarFinal, conn)
    if(turno == "diurno"):
        x='D'
    else: x='N'
    if(paramCampus == "Santo André"):
        y = 'SA'
    else: y = 'SB'
    apresentarFinal2 = f'''
        (SELECT * FROM "public"."Horário das Turmas" t1 WHERE LEFT(t1."Código_Turma",1) = '{x}' AND RIGHT(t1."Código_Turma", 2) = '{y}')
        '''.format(x, y)
    horarios = psql.read_sql(apresentarFinal2, conn)

    apresentarFinal3 = f'''
        (SELECT * FROM "public"."turmas" t1 WHERE t1."CAMPUS" = '{paramCampus}' AND t1."TURNO" = '{turno}') 
        '''.format(paramCampus, turno)
    turmas = psql.read_sql(apresentarFinal3,conn)
    
    vetorDisciplinasCompativeis = {}
    
    for i in disciplinasCurso.itertuples():
        #sigla da disciplina do curso que está no PDF de turmas
        sigla = i.Sigla
        
        #vetor turmas dessa disciplina
        aparicoesSigla = horarios[horarios["Código_Turma"].str.contains(sigla)]["Código_Turma"].unique()
        if len(aparicoesSigla)==0:
            continue
        #fazer a checagem do vetor e colocar em um vetor de disciplinas compativeis
        if len(vetorDisciplinasCompativeis) == 0:
            vetorDisciplinasCompativeis[aparicoesSigla[0]] = []
        elif len(aparicoesSigla) > 0:
            #contagem = 0
            for j in aparicoesSigla:
                contagem = 0
                separaCampus = turmas.loc[turmas["CÓDIGO DE TURMA"] == j]
                if separaCampus.empty:
                    continue
                separaCampus = separaCampus.iloc[0]["CAMPUS"]
                if (separaCampus != paramCampus):
                    continue
                dadosEntrar = horarios.loc[horarios["Código_Turma"] == j]
                for k in vetorDisciplinasCompativeis:
                    dadosGuardada = horarios.loc[horarios["Código_Turma"]==k]
                    joinDia = dadosEntrar.merge(dadosGuardada, on="Dia_Semana")
                    if joinDia.shape[0] == 0:
                        contagem += 1
                    else:
                        for l in range(len(joinDia)):
                            #valor de horario de inicio diferente de inicio de outra disciplina no mesmo dia e não entre os horarios
                            if ((joinDia.iat[l,2] == joinDia.iat[l,6]) | (joinDia.iat[l,2]>joinDia.iat[l,6]) & (joinDia.iat[l,2]<joinDia.iat[l,7])):
                                break
                            elif((joinDia.iat[l,3] == joinDia.iat[l,7]) | (joinDia.iat[l,3]>joinDia.iat[l,6]) & (joinDia.iat[l,3]<joinDia.iat[l,7])):
                                break
                            
                            elif(l==len(joinDia)-1):
                                contagem +=1
                                
                if(contagem == len(vetorDisciplinasCompativeis)):
                    vetorDisciplinasCompativeis[j] = []
                    break

    incompativeis = []
    dictIncompativeis = {}
    #cada chave é uma disciplina, cada valor de chave é um vetor com as disciplinas que possuem o mesmo horário e dia
    for i in disciplinasCurso.itertuples():
        sigla = i[2]
        aparicoesSigla = turmas[turmas["CÓDIGO DE TURMA"].str.contains(sigla)]["CÓDIGO DE TURMA"].unique()

        for j in aparicoesSigla:
            incompativeis.append(j)
            dadosEntrar = horarios.loc[horarios["Código_Turma"] == j][["Dia_Semana","Horário","Horário Fim"]].sort_values(by="Dia_Semana").reset_index(drop=True)
            
            for k in vetorDisciplinasCompativeis.keys():
                dadosDentro = horarios.loc[horarios["Código_Turma"] == k][["Dia_Semana", "Horário", "Horário Fim"]].sort_values(by="Dia_Semana").reset_index(drop=True)
                merged = dadosDentro.merge(dadosEntrar, on = ["Dia_Semana", "Horário","Horário Fim"]).sort_values(by="Dia_Semana").reset_index(drop=True)

                if(merged.equals(dadosDentro) & merged.equals(dadosEntrar)):
                    vetorDisciplinasCompativeis[k].append(j)
                    incompativeis.pop(incompativeis.index(j))
                    break
                
                    
    
    for i in incompativeis:
        if len(dictIncompativeis) == 0:
            dictIncompativeis[i] = []
            continue
        entrou = 0
        for j in dictIncompativeis.keys():
            dadosEntrar = horarios.loc[horarios["Código_Turma"] == i][["Dia_Semana","Horário","Horário Fim"]].sort_values(by="Dia_Semana").reset_index(drop=True)
            dadosDentro = horarios.loc[horarios["Código_Turma"] == j][["Dia_Semana", "Horário", "Horário Fim"]].sort_values(by="Dia_Semana").reset_index(drop=True)
            merged = dadosDentro.merge(dadosEntrar, on = ["Dia_Semana", "Horário","Horário Fim"]).sort_values(by="Dia_Semana").reset_index(drop=True)
            if(merged.equals(dadosDentro) & merged.equals(dadosEntrar)):
                dictIncompativeis[j].append(i)
                entrou = 1
                break    
        if entrou == 0:
            dictIncompativeis[i] = [i]
    
    # print(dictIncompativeis)
    # print(vetorDisciplinasCompativeis)
    
    def dicio(vetorDisciplinasCompativeis, val):
        vetDicioRetorno = []
        for l in vetorDisciplinasCompativeis.keys():
            dadosHorario = horarios.loc[horarios["Código_Turma"]==l]
            i = 1
            tarde = 0 #checa se a disciplina é ministrada na parte da tarde
            dictAux = {"aulas":[]}
            for m in dadosHorario.itertuples():
                if 12 < int(m.Horário) <19:
                    tarde = 1
                    break 
                inicio = m.Horário
                if(inicio == "08"):
                    inicio = "8"
                dictAux["aulas"].append("{} {}-{}".format(m.Dia_Semana.title(),inicio,m[4]))
                i+=1
            if tarde == 1:
                continue
            dictAux["escolhida"] = True & val
            dictAux["disciplinas"] = []
            for n in vetorDisciplinasCompativeis[l]:
                localizarTurma = turmas.loc[turmas["CÓDIGO DE TURMA"]==n]
                if localizarTurma.empty:
                    continue
                nome = localizarTurma.iloc[0]["TURMA"]
                traco = nome[:nome.find("-")].rfind(" ")
                subNome = nome[:traco]
                disciplinasJaColocadas = [x["disciplina"] for x in dictAux["disciplinas"]]

                index = 0
                if(subNome not in disciplinasJaColocadas):
                    index = len(dictAux["disciplinas"])
                    dictAux["disciplinas"].append({"disciplina":"{}".format(subNome),
                                                    "professores":[]})
                    if(len(dictAux["disciplinas"])==1):
                        dictAux["disciplinas"][0]["escolhida"] = True & val
                    else:
                        dictAux["disciplinas"][len(dictAux["disciplinas"])-1]["escolhida"] = False & val
                else:
                    index = disciplinasJaColocadas.index(subNome)
                
                nomesColocar = str("")
                
                for i in range(8,12):
                    nome = str(localizarTurma.iloc[0][i])
                    if((nome != 'None') & (nome not in nomesColocar)):
                        nomesColocar = nomesColocar + ", " + nome
                        #dictAux["disciplinas"][a]["professores"].append("{}".format(nome))
                #print(nomesColocar)
                dictAux2 = {}
                dictAux2["nome"] = nomesColocar[2:]
                dictAux2["escolhida"] = False & val
                dictAux["disciplinas"][index]["professores"].append(dictAux2)
            vetDicioRetorno.append(dictAux)
        return(vetDicioRetorno)
    aqui = dicio(vetorDisciplinasCompativeis, True)
    aqui2 = dicio(dictIncompativeis, False)
    
    return(aqui + aqui2)

######################################################### A P I ############################################################################

@app.route('/')
@cross_origin()
def index():
    texto = "Aqui seria a tela de login. Passar /parametros/?curso=1&turno=diurno&campus=Santo André na URL após o localhost para acessar o json. Pode demorar alguns segundos.\n além disso, da pra colocar turno noturno e campus São Bernardo do Campo"
    return texto

@app.route('/parametros/', methods = ["Get"])
@cross_origin()
def retorno():
    curso = request.args.get("curso")
    turno = request.args.get("turno")
    campus = request.args.get("campus")
    return filtrarPorCursoTurno(curso,turno,campus)
    # retorno = filtrarPorCursoTurno(curso, turno, campus)
    # return retorno

# df = filtrarPorCursoTurno(1,'noturno','Santo André')
if __name__ == "__main__":
    app.run(debug=True)
# # doc = open("dados/arquivo.json", "w", encoding="utf-8")
# # doc.write(json.dumps(df, ensure_ascii=False))
# # doc.close()

# df