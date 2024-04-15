import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewProfessores = (props) => {
  const { professores, onClick } = props;

  if(professores.length === 0)
    return <></>

  return (
    <Card sx={{height:"224px", backgroundColor: '#E9E8E8'}} >
      <Typography sx={{marginLeft: '16px', marginTop: '16px', fontSize: '24px'}}>Professores</Typography>
      {professores.map((professor, index) => (
        <Card
          key={index} 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginLeft: "1px",
            marginRight: "1px",
            cursor: 'pointer',
            justifyContent: "center",
            marginTop: '8px',
            height: '48px',
            marginLeft: '8px',
            marginRight: '8px'
          }}
          onClick={() => onClick(professor.nome)}
        >
          <Typography 
            align="center"
            fontSize={20}>
              {professor.nome}
          </Typography>
        </Card>
      ))}
    </Card>
  );
};

OverviewProfessores.propTypes = {
  professores: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
