import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useLayoutEffect, useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation, useRoute} from '@react-navigation/native';
import {io} from 'socket.io-client';
import axios from 'axios';

const ChatRoomScreen = () => {
  const [message, setMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  // console.log(route?.params);

  const socket = io('http://10.0.2.2:8000');

  const [messages, setMessages] = useState([]);
  socket.on('connect', () => {
    console.log('Connected to the Socket.IO server');
  });

  socket.on('receiveMessage', newMessage => {
    console.log('new Message', newMessage);

    //update the state to include new message
    setMessages(prevMessages => [...prevMessages, newMessage]);
  });

  const sendMessage = async (senderId, receiverId) => {
    socket.emit('sendMessage', {senderId, receiverId, message});

    setMessage('');

    // call the fetchMessages() function to see the UI update
    setTimeout(() => {
      fetchMessages();
    }, 200);
  };

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <ChevronLeftIcon size={25} color={'black'} strokeWidth={3} />
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {route?.params?.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const senderId = route?.params?.senderId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get('http://10.0.2.2:3000/messages', {
        params: {senderId, receiverId},
      });

      setMessages(response.data);
    } catch (error) {
      console.log('Error fetching the messages', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {messages?.map((item, index) => (
          <Pressable
            key={index}
            style={[
              item?.senderId === route?.params?.senderId
                ? {
                    alignSelf: 'flex-end',
                    backgroundColor: '#662d91',
                    padding: 8,
                    maxWidth: '60%',
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: 'flex-start',
                    backgroundColor: '#452c63',
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: '60%',
                  },
            ]}>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'left',
                color: 'white',
                fontWeight: '500',
              }}>
              {item?.message}
            </Text>
            <Text
              style={{
                fontSize: 9,
                textAlign: 'right',
                color: '#F0F0F0',
                marginTop: 5,
              }}>
              {formatTime(item?.timestamp)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: 30,
          gap: 8,
        }}>
        <Entypo
          style={{marginRight: 7}}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={text => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 8,
          }}>
          <Entypo name="camera" size={24} color="gray" />

          <Feather name="mic" size={24} color="gray" />
        </View> */}

        <Pressable
          onPress={() =>
            sendMessage(route?.params?.senderId, route?.params?.receiverId)
          }
          style={{
            backgroundColor: '#662d91',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
