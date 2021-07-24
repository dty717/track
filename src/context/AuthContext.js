import AsyncStorage from "@react-native-community/async-storage";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload.token,todo:action.payload.todo };
    case "setTaskItems":
      return { errorMessage: "",todo:action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    var todo = await AsyncStorage.getItem("todo");
    if(!todo){
      todo = [];
    }else{
      todo = JSON.parse(todo);
    }
    dispatch({ type: "signin", payload: {token,todo} });
    navigate("Todo");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => async ({ user, password }) => {
  try {
    if(user==""){
      await AsyncStorage.setItem("token", "token");
      dispatch({ type: "signin", payload: "token"});
      navigate("TrackList");
      return;
    }
    const response = await trackerApi.post("/signup", { user, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });

    navigate("TrackList");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => async ({ user, password }) => {
  try {
    const response = await trackerApi.post("/signin", { user, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("TrackList");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

const setTaskItems = (dispatch) => async (task) => {
  await AsyncStorage.setItem("todo",JSON.stringify(task));
  dispatch({ type: "setTaskItems", payload: task });
};



export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin,setTaskItems},
  { token: null, errorMessage: "",todo:[] }
);
