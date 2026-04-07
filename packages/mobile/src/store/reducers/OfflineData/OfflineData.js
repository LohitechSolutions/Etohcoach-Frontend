import { ADD_OFFLINE_DATA, DELETE_OFFLINE_DATA, ERR_OFFLINE_DATA, LOADING_OFFLINE_DATA, UPDATE_OFFLINE_DATA,UPDATE_OFFLINE_DATA_STATUS,UPDATE_OFFLINE_API_CALLS,ADD_OFFLINE_API_CALLS, REMOVE_OFFLINE_APIS } from "../../constant";
import { Platform } from "react-native";

const initialState = {
    offlineData: undefined,
    isLoading:false,
    error:null,
    offlineAPIs:[]
  };

  export default function offlineReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_OFFLINE_DATA:
            return {
              ...state,
              error: null,
              isLoading:true,
              offlineData: undefined,
              offlineAPIs:[]
            };

      case ADD_OFFLINE_DATA:
      return {
          ...state,
          error: null,
          isLoading:false,
          offlineData: action.payload,
          offlineAPIs:state.offlineAPIs
       };

      case UPDATE_OFFLINE_DATA:
       
        let filePath = action.payload.filePath;        
        let type = action.payload.type;
        
        let updatedOfflineCoursesData  = JSON.parse(JSON.stringify({...state.offlineData}));
        if(updatedOfflineCoursesData.downloadPercent === undefined) {
          updatedOfflineCoursesData.downloadPercent = 0;
        }
        if(type == 'UserInProgressCourses'){
          filePath.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineCoursesData.user_in_progress_courses =  updatedOfflineCoursesData.user_in_progress_courses.map((singleCourse) => {
                   if(singleCourse?.id === singlePath.index) {
                    let prev =  {...singleCourse};
                    if(Platform.OS === "android") {
                      prev["downloadedPath"] = "file://" + singlePath.filePath;
                    }else {
                      prev["downloadedPath"] = singlePath.filePath;
                    }
                    return prev;
                   }
                   return singleCourse;
               })
            }
          })
          updatedOfflineCoursesData.downloadPercent = updatedOfflineCoursesData.downloadPercent + 20
        }

        if(type == 'AllThemes'||type=="theme"){
          filePath.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineCoursesData.all_themes =  updatedOfflineCoursesData.all_themes.map((singleTheme) => {
                   if(singleTheme?.id === singlePath.index) {
                    let prev =  {...singleTheme};
                    if(Platform.OS === "android") {
                      prev["downloadedPath"] = "file://" + singlePath.filePath;
                    }else {
                      prev["downloadedPath"] = singlePath.filePath;
                    }
                    return prev;
                   }
                   return singleTheme;
               })
            }
          })
          updatedOfflineCoursesData.downloadPercent = updatedOfflineCoursesData.downloadPercent + 20;
        }

        if(type == 'AllLessons'||type=='lesson'){
          filePath.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineCoursesData.all_lessons.data =  updatedOfflineCoursesData.all_lessons.data.map((singleLesson) => {
                   if(singleLesson?.id == singlePath.index) {
                    let prev =  {...singleLesson};
                    if(Platform.OS === "android") {
                      prev.attributes["downloadedPath"] = "file://" + singlePath.filePath;
                    }else {
                      prev.attributes["downloadedPath"] = singlePath.filePath;
                    }
                    return prev;
                   }
                   return singleLesson;
               })
              
            }
          })
          updatedOfflineCoursesData.downloadPercent = updatedOfflineCoursesData.downloadPercent + 20;
        }

        if(type === "AllMockExams") {
          filePath.map((singlePath) => {
            if(singlePath !== undefined) {
              updatedOfflineCoursesData.mock_exams =  updatedOfflineCoursesData.mock_exams.map((upperMock) => {
               return {
                  ...upperMock,
                  mock_exams : upperMock.mock_exams.map((singleMock) => {
                    if(singleMock?.id  == singlePath.index) {
                      console.log("single mock id",singleMock?.id)
                      console.log("single path id", singlePath.index)
                      console.log("single path", singlePath)
                      let prev =  {...singleMock};
                      if(Platform.OS === "android") {
                        prev.attributes["downloadedPath"] = "file://" + singlePath.filePath;
                      }else {
                        prev.attributes["downloadedPath"] = singlePath.filePath;
                      }
                      return prev;                      
                    }else {
                      return singleMock;
                    }
                }) 
              }
              })
             
            }
          })
          updatedOfflineCoursesData.downloadPercent = updatedOfflineCoursesData.downloadPercent + 20
        }

        if(type == 'AllQuizExams'){
          filePath.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineCoursesData.quiz_exams.data =  updatedOfflineCoursesData.quiz_exams.data.map((singleQuiz) => {
                   if(singleQuiz?.id == singlePath.index) {
                    let prev =  {...singleQuiz};
                    if(Platform.OS === "android") {
                      prev.attributes["downloadedPath"] = "file://" + singlePath.filePath;
                    }else {
                      prev.attributes["downloadedPath"] = singlePath.filePath;
                    }
                    return prev;
                   }
                   return singleQuiz;
               })
               
            }
          })
          updatedOfflineCoursesData.downloadPercent = updatedOfflineCoursesData.downloadPercent + 20;
        }    
        // console.log("updated course", JSON.stringify(updatedOfflineCoursesData))
        return {
          ...state,
          error: null,
          isLoading:false,
          offlineData: updatedOfflineCoursesData,
          offlineAPIs:state.offlineAPIs
        };

        case UPDATE_OFFLINE_DATA_STATUS:
        let dataType = action.payload.type;
        let course_data = action.payload.data;
        let updatedOfflineData  = JSON.parse(JSON.stringify({...state.offlineData}));
console.log('course data',dataType)
        if(dataType == 'lesson'){
     console.log('updated course data set',course_data.id,)
               updatedOfflineData.user_in_progress_courses =  updatedOfflineData.all_lessons.data.map((singleCourse) => {
                 if(singleCourse?.id === course_data?.id) {
                   console.log('updated course data',singleCourse)
                   let prev =  {...singleCourse};
                   prev.attributes['user_status'] = "complete";
                   prev.attributes['status'] = "complete";
                   console.log('iterate course data inside',singleCourse,singleCourse.attributes.user_status,course_data.id,'=====updated prev====',prev)
                    return prev;
                   }
                   return singleCourse;
             
          })
        }

        if(dataType == 'AllThemes'){
          course_data.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineData.all_themes =  updatedOfflineData.all_themes.map((singleTheme) => {
                   if(singleTheme?.id === singlePath.index) {
                    let prev =  {...singleTheme};
                      prev.attributes['user_status'] = "complete";
                    return prev;
                   }
                   return singleTheme;
               })
            }
          })
        }

        if(dataType == 'AllLessons'){
          course_data.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineData.all_lessons.data =  updatedOfflineData.all_lessons.data.map((singleLesson) => {
                   if(singleLesson?.id == singlePath.index) {
                    let prev =  {...singleLesson};
                      prev.attributes['user_status'] = "complete"
                    
                    return prev;
                   }
                   return singleLesson;
               })
              
            }
          })
        }

        if(dataType === "AllMockExams") {
          course_data.map((singlePath) => {
            if(singlePath !== undefined) {
              updatedOfflineData.mock_exams =  updatedOfflineData.mock_exams.map((upperMock) => {
                upperMock.mock_exams.map((singleMock) => {
                    if(singleMock?.id  == singlePath.index) {
                      let prev =  {...singleMock};
                      
                        prev.attributes['user_status'] = "complete"
                      
                      return prev;                      
                    }else {
                      return singleMock;
                    }
                }) 
              })
             
            }
          })
        }

        if(dataType == 'AllQuizExams'){
          course_data.map((singlePath) => {
            console.log('index',singlePath?.index);
            if(singlePath !== undefined) {
               updatedOfflineData.quiz_exams.data =  updatedOfflineData.quiz_exams.data.map((singleQuiz) => {
                   if(singleQuiz?.id == singlePath.index) {
                    let prev =  {...singleQuiz};
                    
                      prev.attributes['user_status'] = "complete";
                    return prev;
                   }
                   return singleQuiz;
               })
               
            }
          })
        }    
        return {
          ...state,
          error: null,
          isLoading:false,
          offlineData: updatedOfflineData,
          offlineAPIs:state.offlineAPIs
        };

        case ADD_OFFLINE_API_CALLS:
          var dataSet = [...action.payload.apis]
        return{
          ...state,
          error: null,
          isLoading:false,
          offlineData: state.offlineData,
          offlineAPIs:dataSet
        };

        case UPDATE_OFFLINE_API_CALLS:
          var dataSet = [...state.offlineAPIs,...action.payload.apis];
          return{
            ...state,
            error:null,
            isLoading:false,
            offlineData:state.offlineData,
            offlineAPIs:dataSet
          };

          case REMOVE_OFFLINE_APIS:
          return{
            ...state,
            error:null,
            isLoading:false,
            offlineData:state.offlineData,
            offlineAPIs:[]
          };
        case DELETE_OFFLINE_DATA:
            return {
              ...state,
              error: null,
              isLoading:false,
              offlineData: [],
              offlineAPIs:[]
            };
     
      case ERR_OFFLINE_DATA:
        return {
          ...state,
          isLoading:false,
          error: action,
          offlineAPIs:[]
        };
      default:
        return state;
    }
  }
  