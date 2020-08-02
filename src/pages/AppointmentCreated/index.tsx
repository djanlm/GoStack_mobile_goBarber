import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';
import { useNavigation } from '@react-navigation/native';

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation(); // reset é como o navigate mais reseta as paginas anteriores, assim nao da pra voltar pra elas

  const handleOkPressed = useCallback(() =>{
    reset({
      routes: [
        {
          name: 'Dashboard'
        }
      ],
      index: 0
    })

  }, [reset]);
  return(
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title> Agendamento concluido</Title>
      <Description> Terça, dia 14 de março de 2020 as 12:00h </Description>
      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  )
}

export default AppointmentCreated;
