import psycopg2
import re
import pytest

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

def retornar_dados():
    # Faz a consulta no banco de dados e retorna os resultados
    cur.execute('SELECT DISTINCT * FROM "public"."Horário das Turmas"')
    return cur.fetchall()

def verificar_padrao(rows):
    # Define os padrões regex
    codigo_turma_pattern = r"^[A-Z0-9]+-\d{2}[A-Z]{2}$"  # Letras maiúsculas e/ou números seguidos por '-' e dois números seguidos de duas letras maiúsculas.
    dia_semana_pattern = r"^(segunda|terça|quarta|quinta|sexta|sábado)$"  # Dias da semana, de seg a sab.
    hora_inicio_pattern = r"\d{2}"  # Dois dígitos para representar a hora de início.
    hora_fim_pattern = r"\d{2}"  # Dois dígitos para representar a hora de término.
    tipo_horario_pattern = r"^(semanal|quinzenal I|quinzenal II)\s*$"  # semanal ou quinzenal I ou quinzenal II.

    # Para cada par de linhas consecutivas
    for i in range(len(rows) - 1):
        row1 = rows[i]
        row2 = rows[i + 1]

        # Desempacota as linhas
        codigo_turma1, dia_semana1, hora_inicio1, hora_fim1, tipo_horario1 = row1
        codigo_turma2, dia_semana2, hora_inicio2, hora_fim2, tipo_horario2 = row2

        # Verifica se as linhas têm o mesmo código de disciplina
        if codigo_turma1 == codigo_turma2:
            # Verifica se as linhas têm o mesmo dia da semana e horário
            if dia_semana1 == dia_semana2 and hora_inicio1 == hora_inicio2 and hora_fim1 == hora_fim2:
                print("As linhas", row1, "e", row2, "possuem o mesmo dia da semana e horário.")
                # Pode adicionar mais ações aqui, se necessário

    # Verifica se as linhas seguem o padrão regex
    for row in rows:
        if not (re.match(codigo_turma_pattern, row[0]) and
                re.match(dia_semana_pattern, row[1]) and
                re.match(hora_inicio_pattern, row[2]) and
                re.match(hora_fim_pattern, row[3]) and
                re.match(tipo_horario_pattern, row[4])):
            print("A linha", row, "não segue o padrão regex.")

        if row[2] == row[3]:
            print("A linha", row, "possui horário de início igual ao horário de fim.")

# Obtém os resultados da consulta
resultados = retornar_dados()

# Itera sobre as linhas e verifica o padrão regex e a condição de horário repetido
verificar_padrao(resultados)

#Fechando conexão, boa prática
cur.close()
conn.close()


