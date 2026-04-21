import { ADD_OFFLINE_DATA, DELETE_OFFLINE_DATA,UPDATE_OFFLINE_DATA,ERR_OFFLINE_DATA, LOADING_OFFLINE_DATA, UPDATE_OFFLINE_DATA_STATUS, ADD_OFFLINE_API_CALLS, REMOVE_OFFLINE_DATA,REMOVE_OFFLINE_APIS } from "../../constant";
import {downloadFiles, readFile} from "../../../utils/downloadingFiles";
import RNFS from "react-native-fs";
import { Platform } from "react-native";

export const addOfflineData = params => (dispatch) => dispatch(addOfflineCase(params));
export const removeOfflineData= ()=>(dispatch)=>dispatch(deleteOfflineData());
const deleteOfflineData =()=> ({
    type  : DELETE_OFFLINE_DATA,
})
// const updatedParams = (params) => {
//   let updatedOfflineCourse = {...params};
  
//   updatedOfflineCourse.user_in_progress_courses =  updatedOfflineCourse?.user_in_progress_courses?.map((singleCourse) => {
//       let prev = {...singleCourse};
//       prev["downloadedPath"] = "";
//       // console.log("UserInProgressCourses", JSON.stringify(prev));
//       return prev;
//   })

// // if(type == 'AllCourses'){
// //   updatedOfflineCoursesData.all_courses.map((it,ind)=>{
// //     if(it.id === elementId) {
// //       let prev = {...singleCourse};
// //       prev["downloadedPath"] = filePath;
// //       console.log("AllCourses",JSON.stringify(prev));
// //       return it;
// //     }
// //   })
// // }

//   updatedOfflineCourse.all_themes = updatedOfflineCourse?.all_themes?.map((it,ind)=>{
    
//       let prev = {...it};
//       prev["downloadedPath"] = "";
//       // console.log("AllThemes", JSON.stringify(prev))
//       return prev;
//   })


//   // updatedOfflineCourse?.mock_exams?.map((it,ind)=>{
       
//   //     let prev = {...it};
//   //     prev[subIndex]["downloadedPath"] = "";
//   //     // console.log("AllMockExams", JSON.stringify(prev))
//   //     return prev;
//   // })


//    updatedOfflineCourse.quiz_exams.data =   updatedOfflineCourse?.quiz_exams.data?.map((it,ind)=>{
    
//       let prev = {...it};
//       prev["downloadedPath"] = "";
//       // console.log("AllQuizExams", JSON.stringify(prev))
//       return prev;
    
//   })


//   updatedOfflineCourse.all_lessons.data =  updatedOfflineCourse?.all_lessons.data?.map((it,ind)=>{
   
//       let prev = {...it};
//       prev["downloadedPath"] = "";
//       // console.log("AllLessons", JSON.stringify(prev))
//       return prev;
//   })
//   return updatedOfflineCourse;
// } 

const addOfflineCase= (params)=>async (dispatch, getState)=>{
   await dispatch(addData(params));
  //  console.log("Downloading started....")
   await dispatch(downloadFilesFromResponse(params));
  //  console.log("Download completed")
}
export const updateOfflineStatus = (params)=>(dispatch)=>dispatch(updateStatus(params));
const updateStatus = (params)=>({
  type:UPDATE_OFFLINE_DATA_STATUS,
  payload:{
    type:params.type,
    data:params
  }
})

const addData = params => ({
  type: ADD_OFFLINE_DATA,
  payload: params,
});
export const updateOfflineData = params=>({
   type:UPDATE_OFFLINE_DATA,
   payload:{
      type : params.type,
      // elementId  : params.index,
      filePath : params.filePath,
  //  subIndex : params?.subIndex,
   }
})
export const addOfflineAPis = (params)=>(dispatch)=>dispatch(addAPIS(params));
const addAPIS = (params)=>({
  type:ADD_OFFLINE_API_CALLS,
  payload:{
    apis:params
  }
})
export const removeOfflineAPIS = ()=>(dispatch)=>dispatch(removeAPIS());
const removeAPIS = ()=>({
  type:REMOVE_OFFLINE_APIS
})



const downloadFilesFromResponse = (Offlinedata: any)=>dispatch=> {
   const path = Platform.OS=='ios'?RNFS.DocumentDirectoryPath :RNFS.ExternalDirectoryPath; // for making directory
   const allCourses = Offlinedata?.user_in_progress_courses;
   const allThemes = Offlinedata?.all_themes;
   const allLessons = Offlinedata?.all_lessons?.data;
   const allMockExams = Offlinedata?.mock_exams;
   const allQuizExams = Offlinedata?.quiz_exams?.data;

  //  console.log("ALL COURSES INSIDE DOWNLOAD", JSON.stringify(allCourses))
   
     // Courses Media Download
   //   console.log('entered courses map',allCourses.length)
    Promise.all(allCourses?.map(async(it:any,ind:any)=>{
    if(it.course_attachment != "null" && it.course_attachment != "" && it.course_attachment != null && (it?.downloadedPath === undefined || it?.downloadedPath == "" ) ){
      const fileName = `course_${it.id}`;
      // console.log(fileName, "filenameadsfas");
      try {
      //   console.log('download file resoponse',fileName,it.course_attachment,path)
     
       return {
        filePath :   await downloadFiles(it.course_attachment, path, fileName),
        index : it.id
       };
       //   console.log("filepathtoalbum",filePath);
        // console.log("dispatch update action executed")
        // dispatch(updateOfflineData({type:"UserInProgressCourses",index:it.id,filePath:filePath,subIndex:0}))
       //  console.log("dispatched the action for", fileName)
        // this.props.updateOfflineData({filePath : filePath, index :  it.id})
        // await setAsyncData(fileName, filePath);
        
      } catch (error) {
        console.log(`Failed to download file: ${fileName}`, error);
      }
    }
  })).then((res) => {
    // console.log("@@@", res)   
      dispatch(updateOfflineData({type:"UserInProgressCourses",filePath: res}))
  })
     
     //Themes Media Download
   //   console.log('entered themes map',allThemes.length)
   Promise.all( allThemes?.map(async(it:any,ind:any)=>{
    if(it.theme_attachment != "null" && it.theme_attachment != "" && it.theme_attachment != null && (it?.downloadedPath === undefined || it?.downloadedPath == "" )){
      const fileName = `theme_${it.id}`;
      // console.log(fileName, "filenameadsfas");
      try {
        return {
         filePath : await downloadFiles(it.theme_attachment, path, fileName),
         index : it.id
        }
        // console.log("filepathtoalbum",filePath);
       //  dispatch(updateOfflineData({type:"AllThemes",index:it.id,filePath:filePath,subIndex:0}))
        // await setAsyncData(fileName, filePath);
      } catch (error) {
        console.log(`Failed to download file: ${fileName}`, error);
      }
    }
  })).then((res) => {
    // console.log("theme all",res)
    dispatch(updateOfflineData({type:"AllThemes",filePath: res}))
  })
 
     //Lessons Media Download
    //  console.log('entered lessons map',allLessons.length)
     Promise.all(
      allLessons?.map(async(it:any,ind:any)=>{
        if(it.attributes.image != "null" && it.attributes.image != "" && it.attributes.image != null && (it?.attributes?.downloadedPath === undefined || it?.attributes?.downloadedPath == "" )){
          const fileName = `lesson_image_${it.id}`;
          // console.log(fileName, "filenameadsfas");
          try {
            return {
             filePath : await downloadFiles(it.attributes.image, path, fileName),
             index:  it.id
            }
            // console.log("filepathtoalbum",filePath);
           //  dispatch(updateOfflineData({type:"AllLessons",index:it.id,filePath:filePath,subIndex:0}))
            // await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
        if(it.attributes.video_file !== "" && it.attributes.video_file !== null && it.attributes.video_file !== "null" && (it?.attributes?.downloadedPath === undefined || it?.attributes?.downloadedPath == "" )){
          const fileName = `lesson_video_${it.id}`
          // console.log(fileName, "filenameadsfas");
          try {
            return {
              filePath :  await downloadFiles(it.attributes.video_file, path, fileName),
              index : it.id
            }
            // console.log("filepathtoalbum",filePath);
          //   dispatch(updateOfflineData({type:"AllLessons",index:it.id,filePath:filePath,subIndex:0}))
            // await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
            
          }
        }
        if(it.attributes.audio_file !== "" && it.attributes.audio_file !== null && it.attributes.audio_file !== "null" && (it?.attributes?.downloadedPath === undefined || it?.attributes?.downloadedPath == "" ) ){
          const fileName = `lesson_audio_${it.id}`
          // console.log(fileName,it.attributes.audio_file, "filenameadsfas");
          try {
            return {
             filePath : await downloadFiles(it.attributes.audio_file, path, fileName),
             index : it.id
            }
            // console.log("filepathtoalbum",filePath);
          //   dispatch(updateOfflineData({type:"AllLessons",index:it.id,filePath:filePath,subIndex:0}))
            // await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })
     ).then((res) => {
        // console.log("lesson all", res);
        dispatch(updateOfflineData({type:"AllLessons",filePath: res}))
     })

     //Mock Exams Media Download
   
      allMockExams?.map(async(it:any,ind:any)=>{
        Promise.all(
          it?.mock_exams.map(async(item:any,index:any)=>{
            if(item.attributes.image !== null && item.attributes.image !== "" && item.attributes.image !== "null" && (item?.attributes?.downloadedPath === undefined || item?.attributes?.downloadedPath == "" )){
              const fileName = `mock_exam_${item.id}`
              // console.log(fileName, "filenameadsfas");
              try {
                return {
                  filePath :  await downloadFiles(item.attributes.image, path, fileName),
                  index  : item.id,
                  
                }
                // console.log("filepathtoalbum",filePath);
               //  dispatch(updateOfflineData({type:"AllMockExams",index:it.id,filePath:filePath,subIndex:index}))
                // await setAsyncData(fileName, filePath);
    
              } catch (error) {
                console.log(`Failed to download file: ${fileName}`, error);
              }
            }
          })
        ).then((res) => {
          // console.log("MOCK EXAMS", res)
          dispatch(updateOfflineData({type:"AllMockExams",filePath : res}))
        })
      })
     
 
     //Quiz Media Download
   //   console.log('entered quiz map',allQuizExams.length)
    Promise.all(
      allQuizExams.map(async(it:any,ind:any)=>{
        if(it?.attributes?.image != "null" && it?.attributes?.image != "" && it?.attributes?.image != null && (it?.attributes?.downloadedPath === undefined || it?.attributes?.downloadedPath == "" )){
          const fileName = `quiz_exam_${it.id}`;
          // console.log(fileName, "filenameadsfas");
          try {
            return {
              filePath :  await downloadFiles(it?.attributes?.image, path, fileName),
              index  : it.id
            }
            // console.log("filepathtoalbum",filePath);
          //   dispatch(updateOfflineData({type:"AllQuizExams",index:it.id,filePath:filePath,subIndex:0}))
            // await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })
    ).then((res) => {
      // console.log("QUIZ EXAM",res)
      dispatch(updateOfflineData({type:"AllQuizExams",filePath : res}))
    })
   // }
  //  console.log('function executed')
 }


export function getOfflineAction(params) {
   console.log('params of offline',params)
   
   return {
    type  : ADD_OFFLINE_DATA,
    payload:params
   }
}

export function loadingOfflineData(params) {
   return {
      type : LOADING_OFFLINE_DATA,
      payload : params
   }
} 

// export const getOfflineAction = () => dispatch => dispatch(callOfflineData());

const callOfflineData = () => ({
    type: ADD_OFFLINE_DATA,
  });