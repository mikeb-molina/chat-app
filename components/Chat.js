import { useEffect, useState } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView} from "react-native";
import { GiftedChat, Bubble, InputToolbar} from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({db, route, navigation, isConnected}) => {
    const [messages, setMessages] = useState([]);
    const {name, background, userID} = route.params;
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }


        // set username
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    let unsubMessages;
        // messages database
    useEffect(() => {
        if (isConnected === true) {
            if(unsubMessages) unsubMessages();
            //unsubMessages = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (documentSnapshot) => {
          let newMessages = [];
          documentSnapshot.forEach(doc => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            })
          });
          cacheMessages(newMessages)
          setMessages(newMessages);
        })
    } else loadCachedMessages();
        return () => {
          if (unsubMessages) unsubMessages();
        }
}, [isConnected]);

const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
};


const cacheMessages = async (messagesToCache) => {
    try{
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
        console.log(error.message);
    }
};

    const renderBubble = (props) => {
        return <Bubble
        {...props}
        wrapperStyle={{
            right: {
                backgroundColor: "#000"
            },
            left: {
                backgroundColor: "#FFF"
            }
        }}
        />
    }

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    return(
        <View style={[styles.container, { backgroundColor: background}]}>
        <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        user={{
            _id: userID,
            name: name
        }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior= "height" /> : null}
       
        </View>
    )
}

const styles= StyleSheet.create({
    container: {
        flex:1,
    }
});

export default Chat;