import React, {useContext, useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from '../components/Task';
import { FontAwesome } from '@expo/vector-icons';
import { Context as AuthContext } from '../context/AuthContext';
import {
  Accuracy,
  getCurrentPositionAsync,
} from 'expo-location';

import Api from "../api/Api";
import {Human} from '../script/notification'
const TodoScreen = () => {
  const [task, setTask] = useState();
  const { state,setTaskItems } = useContext(AuthContext);
  useEffect(async()=>{
    // var bodyFormData = new FormData();
    // bodyFormData.append('username', 'dty717');
    // bodyFormData.append('password', 'd52180362'); 
    // var val = await Api.post('/login', bodyFormData, {headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    // alert(123)
    try {
      var val = await Api.get('C:/Users/18751/Desktop/新建工程/关于网站设计开发-2/代码/script/ai/human.txt', {
        auth: {
          username: 'dty717',
          password: 'd52180362'
        },
      })
      var human = new Human();
      human.loadHistoryContentStr(val.data);
      // setTaskItems([...state.todo, ... human.searchThinkingWithoutChildren()])
     //;
      // Api.get('/root/IDE/script/ai/human.txt', {
      //   auth: {
      //     username: 'dty717',
      //     password: 'd52180362'
      //   }
      // }).then((obj)=>{
      //   alert(JSON.stringify(obj));
      // }).catch((e)=>{
      //   alert(e);
      // })
    } catch (error) {
      console.log({error})
      // alert("error "+JSON.stringify(error))
    }
  },[])

  const handleAddTask =async () => {
    Keyboard.dismiss();
    let location;
    try {
      location = await getCurrentPositionAsync({accuracy:Accuracy.Lowest});
    } catch (e) {
    }
    setTaskItems([...state.todo, {task,time:new Date(),location:{lat:location.coords.latitude,lon:location.coords.longitude}}])
    setTask(null);
  }

  const completeTask = (index) => {
    let itemsCopy = [...state.todo];
    var item = itemsCopy.splice(index, 1);
    alert(JSON.stringify(item[0].location)+"\r\n"+(new Date()-new Date(item[0].time))/1000+"\r\n"+item[0].time+"\r\n"+new Date())
    setTaskItems(itemsCopy);
  }

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            state.todo.map((item, index) => {
              return (
                <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
                  <Task text={item.task} /> 
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});

TodoScreen.navigationOptions = {
  title: 'Account',
  tabBarIcon: <FontAwesome name="gear" size={20} />
};
export default TodoScreen;
