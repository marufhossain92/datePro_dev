import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import Carousel from 'react-native-snap-carousel';

const HandleLikeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  console.log('ROUTEEEEE', route?.params);

  const createMatch = async () => {
    try {
      const currentUserId = route?.params?.userId; // Example currentUserId
      const selectedUserId = route?.params?.selectedUserId; // Example selectedUserId
      const response = await axios.post('http://10.0.2.2:3000/create-match', {
        currentUserId,
        selectedUserId,
      });

      if (response.status === 200) {
        navigation.goBack();
        // Handle success, such as updating UI or showing a success message
      } else {
        console.error('Failed to create match');
        // Handle failure, such as showing an error message
      }
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const match = () => {
    Alert.alert('Accept Request?', `Match with ${route?.params?.name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: createMatch},
    ]);
    // navigation.goBack()
  };

  function calculateAge(dateOfBirth) {
    // Split the date string into day, month, and year
    const parts = dateOfBirth.split('/');
    const dob = new Date(parts[2], parts[1] - 1, parts[0]); // Month is 0-based

    // Calculate the difference in milliseconds between the current date and the date of birth
    const diffMs = Date.now() - dob.getTime();

    // Convert the difference to a Date object
    const ageDate = new Date(diffMs);

    // Extract the year part from the Date object and subtract 1970 to get the age
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
  }

  let images = route?.params?.imageUrls;

  const renderImageCarousel = ({item}) => (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={{
          width: '95%',
          resizeMode: 'cover',
          height: 450,
          borderRadius: 10,
        }}
        source={{uri: item}}
      />
      <Text style={{position: 'absolute', top: 10, right: 15, color: 'white'}}>
        {activeSlide + 1}/{images.length}
      </Text>
    </View>
  );

  return (
    <View style={{marginTop: 35}}>
      <ScrollView>
        <View className="justify-between items-center flex-row w-full pb-2 pl-2">
          <TouchableOpacity
            className="w-2/3 flex-row items-center"
            onPress={() => navigation.navigate('Likes')}>
            <ChevronLeftIcon size={25} color={'black'} strokeWidth={3} />
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 12, marginVertical: 12}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                  {route?.params?.name}
                </Text>
                <View
                  style={{
                    backgroundColor: '#452c63',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    new here
                  </Text>
                </View>
              </View>
            </View>

            <View style={{marginVertical: 15}}>
              {/* images carousel */}
              <View>
                {images?.length > 0 && (
                  <View>
                    <Carousel
                      data={images}
                      renderItem={renderImageCarousel}
                      sliderWidth={350}
                      itemWidth={300}
                      onSnapToItem={index => setActiveSlide(index)}
                    />
                  </View>
                )}
              </View>

              {/* profile details */}
              {/* <View style={{marginTop: 20}}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 8,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 5,
                      alignItems: 'center',
                      gap: 20,
                      borderBottomWidth: 0.8,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <MaterialCommunityIcons
                        name="cake-variant-outline"
                        size={22}
                        color="black"
                      />
                      <Text style={{fontSize: 15}}>23</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <Ionicons name="person-outline" size={20} color="black" />
                      <Text style={{fontSize: 15}}>
                        {route?.params?.currentProfile?.gender}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <Ionicons name="magnet-outline" size={20} color="black" />
                      <Text style={{fontSize: 15}}>
                        {route?.params?.currentProfile?.type}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <Octicons name="home" size={20} color="black" />
                      <Text style={{fontSize: 15}}>
                        {route?.params?.currentProfile?.hometown}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 15,
                      borderBottomWidth: 0.8,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <Ionicons name="bag-add-outline" size={20} color="black" />
                    <Text>{route?.params?.currentProfile?.profession}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 15,
                      borderBottomWidth: 0.8,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <SimpleLineIcons
                      name="graduation"
                      size={22}
                      color="black"
                    />
                    <Text>{route?.params?.currentProfile?.education}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 15,
                      borderBottomWidth: 0.8,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <Ionicons name="book-outline" size={20} color="black" />
                    <Text>{route?.params?.currentProfile?.religion}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 15,
                      borderBottomWidth: 0.8,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <Ionicons name="home-outline" size={20} color="black" />
                    <Text>{route?.params?.currentProfile?.location}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 15,
                      borderBottomWidth: 0.7,
                      borderBottomColor: '#E0E0E0',
                      paddingBottom: 10,
                    }}>
                    <Feather name="search" size={20} color="black" />
                    <Text>{route?.params?.currentProfile?.lookingFor}</Text>
                  </View>
                </View>
              </View> */}
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            marginTop: 20,
          }}>
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              Want to match? Click the message button?
            </Text>
          </View>
          <View>
            <Pressable
              onPress={match}
              style={{
                backgroundColor: 'white',
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="message-outline"
                size={25}
                color="#C5B358"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HandleLikeScreen;
