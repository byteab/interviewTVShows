import * as React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
const API_URL = 'https://api.tvmaze.com/search/shows?q=';

type Data = {
  score: string;
  show: {
    id: number;
    url: string;
    name: string;
    image: {
      medium: string;
      original: string;
    };
  };
}[];
const List = () => {
  const [state, setState] = React.useState({
    data: [] as Data,
    // idle, loading, resolved, rejected
    status: 'loading',
    numberOfItems: 10,
    reason: '',
  });

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(API_URL + state.numberOfItems);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setState(prev => ({
              ...prev,
              data,
              status: 'resolved',
            }));
          } else {
            setState(prev => ({
              ...prev,
              status: 'resolved',
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            status: 'rejected',
            reason: 'something went wrong!',
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          status: 'rejected',
          reason: error.message,
        }));
      }
    })();
  }, [state.numberOfItems]);

  if (state.status === 'loading') {
    // this is temporary
    return (
      <View>
        <Text>Loading.. </Text>
      </View>
    );
  }
  if (state.status === 'resolved') {
    console.log(state.data);
  }
  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.flatListContainer}
      data={state.data}
      renderItem={({
        item: {
          score,
          show: {
            id,
            name,
            url,
            image: {medium, original},
          },
        },
      }) => {
        return (
          <View style={itemStyles.container} key={id}>
            <View style={itemStyles.top}>
              <Text style={itemStyles.score}>{'Score: ' + score}</Text>
              <Text style={itemStyles.name}>{`Name: ${name}`}</Text>
            </View>
            <Image
              resizeMode="cover"
              style={itemStyles.image}
              source={{uri: original}}
            />
          </View>
        );
      }}
    />
  );
};

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'center',
    marginBottom: 10,
  },
  top: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  score: {
    fontSize: 15,
  },
  image: {
    width: 300,
    height: 500,
  },
  name: {},
});

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: '#fff',
  },
  flatListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
});

export default List;
