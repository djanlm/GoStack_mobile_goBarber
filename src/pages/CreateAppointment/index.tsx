import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
 } from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id:string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
   const { user } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  // o providerIdvem como parametro da rota, criamos essa interface pra que o typescrpt reconheça oq tá vindo
  const routeParams = route.params as RouteParams;

  const [ showDatePicker, setShowDatePicker ] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId); // tem q ser criado depois de já ter chamado o providerId
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  // get providers to list them on the top of the page
  useEffect(()=> {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  // get the day availability
  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() +1,
        day: selectedDate.getDate(),
      },
    }).then(response => {
      setAvailability(response.data);
    })
  }, [selectedDate,selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string)=> {
    setSelectedProvider(providerId);
  },[])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state); // poderia ser asim tb setShowDatePicker(!showDatePicker);
  }, []);

  const handleDateChange = useCallback(
    (event: any, date: Date | undefined) => {
    if(Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if(date) {
      setSelectedDate(date);
    }

  },[]);

  const morningAvailability = useMemo(()=> {
    return availability.filter(({ hour })=> hour < 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }
    })
  },[availability]);

  const afternoonAvailability = useMemo(()=> {
    return availability.filter(({ hour })=> hour >= 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }
    })
  },[availability]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', {date: date.getTime()});
    } catch(err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return(
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source= {{uri: user.avatar_url }}/>
      </Header>
  <Content>
    <ProvidersListContainer>
      <ProvidersList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={providers}
        keyExtractor={(provider) => provider.id}
        renderItem = {({ item: provider}) => (
            <ProviderContainer
              onPress={()=> handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
            <ProviderAvatar source={{uri: provider.avatar_url}} />
            <ProviderName  selected={provider.id === selectedProvider}>
              {provider.name}</ProviderName>
            </ProviderContainer>
          )}
      />
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
        <OpenDatePickerButtonText> Selecionar outra data </OpenDatePickerButtonText>
        </OpenDatePickerButton>
        {showDatePicker && (
          <DateTimePicker
          mode="date"
          display="calendar"
          onChange={handleDateChange}
          textColor="#f4ede8"
          value={selectedDate}
          />
        )}
      </Calendar>

      <Schedule>
        <Title>Escolha o horário</Title>
        <Section>
          <SectionTitle>Manhã</SectionTitle>
          <SectionContent>
            {morningAvailability.map(({hourFormatted, hour, available}) => (
            	<Hour
              enabled = {available}
              selected = {selectedHour === hour}
              onPress={()=> handleSelectHour(hour)}
              available={available}
              key={hourFormatted}
              >
                <HourText selected = {selectedHour === hour}>{hourFormatted}</HourText>
              </Hour>
          ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Tarde</SectionTitle>
          <SectionContent >
          {afternoonAvailability.map(({hourFormatted, hour, available}) => (
            <Hour
              enabled = {available}
              selected = {selectedHour === hour}
              onPress={()=> handleSelectHour(hour)}
              available={available}
              key={hourFormatted}
            >
            <HourText selected = {selectedHour === hour}>{hourFormatted}</HourText>
            </Hour>
           ))}
          </SectionContent>
        </Section>
      </Schedule>

      <CreateAppointmentButton onPress={handleCreateAppointment}>
        <CreateAppointmentButtonText> Agendar </CreateAppointmentButtonText>
      </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment;
