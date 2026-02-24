a1.Auth
  1.1 SignUp(just for learner,instructor role )[anyone cant signUp with admin role]

   url:http://localhost:5000/api/auth/signup
   method:post
   body:(bank_acount and secret_key is optional)
   {
  "fullName": "Tanmoy Ghosh",
  "userName": "tanmoy",
  "email": "tan@gmail.com",
  "password": "t@08976",
  "role":"instructor"
  }
  
  response:
          {
         "statusCode": 201,
         "data": {
            "id": "693accb32a6b4be9c4ac291f",
            "role": "Learner",
            "email": "emon@gmail.com",
            "userName": "emon"
         },
         "message": "Learner created successfully",
         "success": true
         }
  ***************************************************************************************************************************************
  
  1.2 logIn(all can do)
   url:http://localhost:5000/api/auth/login
   method:post
   body:{
    "email":"taposhg522@gmail.com",
    "password":"65432",
    "role":"learner"
  }
  response:
      {
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "693accb32a6b4be9c4ac291f",
            "fullName": "emon hasan",
            "userName": "emon",
            "email": "emon@gmail.com",
            "role": "Learner",
            "certificates_earned": [],
            "courses_enrolled": [],
            "createdAt": "2025-12-11T13:52:51.230Z",
            "updatedAt": "2025-12-11T13:55:02.814Z",
            "__v": 0
        },
        "accessToken":    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhY2NiMzJhNmI0YmU5YzRhYzI5MWYiLCJlbWFpbCI6ImVtb25AZ21haWwuY29tIiwicm9sZSI6IkxlYXJuZXIiLCJ1c2VyTmFtZSI6ImVtb24iLCJpYXQiOjE3NjU0NjEzMDIsImV4cCI6MTc2NTQ2MjIwMn0.9hpG3gSg_3WvAONcdmxfB1uX8_8UH4r7aXCRIHchN2I",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhY2NiMzJhNmI0YmU5YzRhYzI5MWYiLCJyb2xlIjoiTGVhcm5lciIsImlhdCI6MTc2NTQ2MTMwMiwiZXhwIjoxNzY2MDY2MTAyfQ.7inDqMXDGB32-MYwVzbPOksmmWVJ8UTpLlokPM_BJAY"
    },
    "message": "Learner logged in successfully",
    "success": true
    }
    
    ************************************************************************************************************************************************************
  
  1.3 logout(all can do)
    url:http://localhost:5000/api/auth/logout
    method:post
    body:null
    response:
       {
        "statusCode": 200,
        "data": {},
        "message": "User logged out successfully",
        "success": true
       }
       
    ************************************************************************************************************************************************************
    
 ** Anyone after signup or login if her/his has no bank_account
   ->>Show a notification that (Please Create a bank account on our bank)

 **************************************************************************************************************************************************************
** In side-bar(for all admin,instructor,learner)
  ** include CreateBankAccount option if has no
      url:http://localhost:5000/api/bank/create-account
      method:post
      body:null
      response:
         "statusCode": 201,
    "data": {
        "bank_account_number": "AC1765461793379314",
        "bank_secret": "9721950964e8",
        "current_balance": 5000
    },
    "message": "Congrats! Account Create successfully.For adding balance contact with Bank.",
    "success": true
    }
  *************************************************************************************************************************************************************
    
  ** get All courses Option(if role='learner' add enrolled option to each showing courses)
       url:http://localhost:5000/api/course/get-courses
       method:get
       response:{
    "statusCode": 200,
    "data": [
        {
            "_id": "6935d063def7f6aa718b6e63",
            "title": "Full Stack Development",
            "description": "Learn full stack from zero to hero",
            "price": 499,
            "totalVideos": 3,
            "enrolledStudents": 0,
            "instructor": null,
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765134433/ykdh6i8t4adhk5erkwm4.mp4"
        },
        {
            "_id": "6936c80d74811d0179082c02",
            "title": "Full Stack Development",
            "description": "Learn full stack from zero to hero",
            "price": 499,
            "totalVideos": 1,
            "enrolledStudents": 0,
            "instructor": {
                "name": "Tanmoy Ghosh",
                "username": "tanmoy"
            },
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765197836/aerkd7ujvf41svezaoxi.mp4"
        },
        {
            "_id": "69380cdea9eb27167f59def2",
            "title": "Syber-security course",
            "description": "Learn full hacking from zero to hero",
            "price": 799,
            "totalVideos": 1,
            "enrolledStudents": 0,
            "instructor": {
                "name": "Tarun Ghosh",
                "username": "tarun"
            },
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765280989/lutlz0r7uamwvlfxml8o.mp4"
        }
        "message": "Success",
        "success": true
     }
   ******************************************************************************************************************************************************
   
  ** get All Courses by Catagory(if role='learner' add enrolled option to each showing courses)
      url:http://localhost:5000/api/course/by-category
      method:get
      response:{
    "statusCode": 200,
    "data": [
        {
            "_id": "Database",
            "courses": [
                {
                    "_id": "69381254a9eb27167f59df27",
                    "title": "Database",
                    "description": "Learn full databse from zero to hero",
                    "price": 499,
                    "instructor": {
                        "fullName": "Tarit Hasan",
                        "userName": "tarit"
                    },
                    "enrolledCount": 1,
                    "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765282387/oqdcuasryb2f1yiijscq.mp4"
                },
                {
                    "_id": "69381e1dda4cccdf1ab43b01",
                    "title": "Database",
                    "description": "Learn full databse from zero to hero",
                    "price": 589,
                    "instructor": {
                        "fullName": "Tarun Ghosh",
                        "userName": "tarun"
                    },
                    "enrolledCount": 1,
                    "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765285403/yjqjnxouqex1gwemrcgx.mp4"
                }
            ],
            "totalCourses": 2,
            "totalEnrollments": 2
        },
        {
            "_id": "Data Scientist",
            "courses": [
                {
                    "_id": "69380e2ca9eb27167f59defd",
                    "title": "Data Scientist",
                    "description": "Learn full data science from zero to hero",
                    "price": 999,
                    "instructor": {
                        "fullName": "Tarun Ghosh",
                        "userName": "tarun"
                    },
                    "enrolledCount": 1,
                    "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765281322/b9shk2tmbg5dxp7nujvh.mp4"
                }
            ],
            "totalCourses": 1,
            "totalEnrollments": 1
        }
        "message": "Courses grouped by category",
        "success": true
     }
   *********************************************************************************************************************************************************
   
   
  ** get top view courses(if role='learner' add enrolled option to each showing courses)
      url:http://localhost:5000/api/course/most-enrolled
      method:get
      response:
           {
    "statusCode": 200,
    "data": [
        {
            "_id": "693810d0a9eb27167f59df08",
            "title": "Operating System",
            "description": "Learn full Operatttting system from zero to hero",
            "price": 999,
            "instructor": {
                "fullName": "Tarun Ghosh"
            },
            "enrolledCount": 1,
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765281998/hdxxzevmn6evhgm7wojr.mp4"
        },
        {
            "_id": "69380e2ca9eb27167f59defd",
            "title": "Data Scientist",
            "description": "Learn full data science from zero to hero",
            "price": 999,
            "instructor": {
                "fullName": "Tarun Ghosh"
            },
            "enrolledCount": 1,
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765281322/b9shk2tmbg5dxp7nujvh.mp4"
        }
        "message": "Top courses fetched",
        "success": true
     }
     
     ********************************************************************************************************************************************************
  ** get user current balance
     url:http://localhost:5000/api/bank/current-balance
     method:get
     response:{
    "statusCode": 200,
    "data": {
        "account_number": "AC1765461793379314",
        "current_balance": 5000
    },
    "message": "Current balance fetched successfully",
    "success": true
   }
   **********************************************************************************************************************************************************
       3.1 Search Courses option
          ** Search by title
             url:http://localhost:5000/api/learner/search-courses?q=machine learning
             method:get
             response:
                                                      {
        "success": true,
    "count": 1,
    "courses": [
          {
            "_id": "693811e1a9eb27167f59df20",
            "title": "Machine learning",
            "description": "Learn full Machine learning from zero to hero",
            "price": 499,
            "lumpSumPayment": 500,
            "instructor": "Tarit Hasan",
            "instructorEmail": "tarit@gmail.com",
            "createdAt": "2025-12-09T12:11:13.401Z"
          }
       ]
   } 
  ************************************************************************************************************************************************************
        ** search all Courses of a Instructor
             url:http://localhost:5000/api/learner/instructor-courses?q=tarit
             method:get
             response:
                                                       
                                                                  {
       "statusCode": 200,
      "data": [
        {
            "_id": "693811e1a9eb27167f59df20",
            "title": "Machine learning",
            "description": "Learn full Machine learning from zero to hero",
            "price": 499,
            "totalVideos": 1,
            "instructor": {
                "name": "Tarit Hasan",
                "username": "tarit"
            }
        },
        {
            "_id": "69381254a9eb27167f59df27",
            "title": "Database",
            "description": "Learn full databse from zero to hero",
            "price": 499,
            "totalVideos": 1,
            "instructor": {
                "name": "Tarit Hasan",
                "username": "tarit"
            }
        }
    ],
    "message": "Found 2 course(s)",
    "success": true
  }
  ************************************************************************************************************************************************************
2.After SignUp or login as Instructor
   2.0 show instuctors all courses(if have no courses ,show notification(You have no Courses,Please Create Qualityful Courses)
       url:http://localhost:5000/api/instructor/my-courses
       method:get
       response:{
    "statusCode": 200,
    "data": {
        "courses": [
            {
                "courseId": "69380cdea9eb27167f59def2",
                "title": "Syber-security course",
                "price": 799,
                "studentsEnrolled": 0,
                "earningsFromThisCourse": 0
            },
            {
                "courseId": "69380e2ca9eb27167f59defd",
                "title": "Data Scientist",
                "price": 999,
                "studentsEnrolled": 1,
                "earningsFromThisCourse": 799.2
            },
            {
                "courseId": "693810d0a9eb27167f59df08",
                "title": "Operating System",
                "price": 999,
                "studentsEnrolled": 1,
                "earningsFromThisCourse": 799.2
            },
            {
                "courseId": "69381e1dda4cccdf1ab43b01",
                "title": "Database",
                "price": 589,
                "studentsEnrolled": 1,
                "earningsFromThisCourse": 471.20000000000005
            }
        ],
        "totalEarnings": 2069.6000000000004
    },
    "message": "Success",
    "success": true
  }
  ****************************************************************************************************************************************************************
  
  
 cornerside-bar:
      
  2.2 CreateCourse option
    url:http://localhost:5000/api/instructor/create-course
    method:form-data
    body:
  | Key            | Value                                                                                                                  | Type |
  | -------------- | ---------------------------------------------------------------------------------------------------------------------- | ---- |
  | title          | Full Stack Development Course                                                                                          | Text |
  | description    | Learn full stack from zero to hero                                                                                     | Text |
  | price          | 499                                                                                                                    | Text |
  | videoTitles    | ["Intro","Lesson 1","Lesson 2"]                                                                                        | Text |
  | videoDurations | [120,300,240]                                                                                                          | Text |
  | resources      | [{"title":"Notes","mediaType":"document_link","url":"[https://example.com/notes.pdf](https://example.com/notes.pdf)"}] | Text |
  | files          | (upload multiple videos)                                                                                               | File |
  | files          | (upload multiple videos)                                                                                               | File |
  | files          | (upload multiple videos)                                                                                               | File |
  
  response:
    {
    "statusCode": 201,
    "data": {
        "title": "Database",
        "description": "Learn full databse from zero to hero",
        "price": 589,
        "instructor": "69380bd7a9eb27167f59dee3",
        "lumpSumPayment": 500,
        "videos": [
            {
                "title": "Intro",
                "url": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765464389/mojs1xgdk3yut4u1qchl.mp4",
                "duration_seconds": 120,
                "_id": "693ad94735d0b1aed44dc48d"
            }
        ],
        "resources": [
            {
                "title": "Database",
                "mediaType": "document_link",
                "url": "https://example.com/Database.pdf",
                "_id": "693ad94735d0b1aed44dc48e"
            }
        ],
        "_id": "693ad94735d0b1aed44dc48c",
        "createdAt": "2025-12-11T14:46:31.141Z",
        "updatedAt": "2025-12-11T14:46:31.141Z",
        "__v": 0
    },
    "message": "Course created successfully",
    "success": true
   }
   
   ******************************************************************************************************************************************************************
  
 2.3 Instructor earning chart
    url:http://localhost:5000/api/instructor/total-earning-forChart
    method:get
    
    response:
      {
    "statusCode": 200,
    "data": [
        {
            "title": "Operating System",
            "totalEarning": 799.2,
            "courseId": "693810d0a9eb27167f59df08"
        },
        {
            "title": "Data Scientist",
            "totalEarning": 799.2,
            "courseId": "69380e2ca9eb27167f59defd"
        },
        {
            "title": "Database",
            "totalEarning": 471.20000000000005,
            "courseId": "69381e1dda4cccdf1ab43b01"
        }
    ],
    "message": "Success",
    "success": true
    }
    
    ****************************************************************************************************************************************
  
 2.4 In each existing courses(Her/His all courses)
    2.4.0  Option:
           ** get Course Details
              url:http://localhost:5000/api/instructor/course/:courseId/details
              method:get
              response:
                 {
    "statusCode": 200,
    "data": {
        "courseId": "69380cdea9eb27167f59def2",
        "title": "Syber-security course",
        "description": "Learn full hacking from zero to hero",
        "price": 799,
        "lumpSumPayment": 500,
        "createdAt": "2025-12-09T11:49:50.604Z",
        "updatedAt": "2025-12-09T11:49:50.604Z",
        "totalEnrolled": 0,
        "instructorEarnings": 0,
        "totalVideos": 1,
        "totalResources": 1,
        "videos": [
            {
                "videoId": "69380cdea9eb27167f59def3",
                "title": "Intro",
                "url": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765280989/lutlz0r7uamwvlfxml8o.mp4",
                "duration_seconds": 120
            }
        ],
        "resources": [
            {
                "resourceId": "69380cdea9eb27167f59def4",
                "title": "syber",
                "mediaType": "document_link",
                "url": "https://example.com/syber-security.pdf"
            }
        ]
    },
    "message": "Course details fetched successfully",
    "success": true
  }
   ********************************************************************************************************************************************************************************           
           ** add Resourses
             url:http://localhost:5000/api/instructor/:courseId/add-resources
             method:post
             body:{
             "resources": [
                   { "title": "Notes", "mediaType": "document_link", "url": "https://example.com/note.pdf" }
                ]
             }
             
             response:
                {
             "statusCode": 200,
             "data": {
            "added": 1,
            "total": 2
          },
          "message": "Resources added successfully",
          "success": true
          }
 ***************************************************************************************************************************************************            
            ** Delete Resourses or vedios
              url:http://localhost:5000/api/instructor/:courseId/resource/:itemId
              method:delete
              body:null
              response:
                 {
                 "statusCode": 200,
                 "data": null,
                 "message": "Video deleted successfully",
                 "success": true
                }
 ****************************************************************************************************************************************************             
              
            ** add Vedio
               url:http://localhost:5000/api/instructor/:courseId/add-videos
               method:form-data
               body: files --- upload vedio
               response:
                  {
                  "statusCode": 200,
              "data": {
                  "added": 1,
                   "total": 2
              },
               "message": "Videos added successfully",
               "success": true
              }
            **Get approved students for a specific course(getApproveStudents)
              url:http://localhost:5000/api/instructor/approve-students/:courseId
              method:get
              response:
                 {
               "statusCode": 200,
            "data": [
             {
            "_id": "69383c12da4cccdf1ab43b1c",
            "type": "PURCHASE",
            "amount": 999,
            "from_user": {
                "_id": "6936c5b274811d0179082be9",
                "fullName": "Tk Ghosh",
                "userName": "tk",
                "bank_account_number": "AC1765203487655476"
            },
            "from_account_number": "AC1765203487655476",
            "to_user": "69380bd7a9eb27167f59dee3",
            "to_account_number": "AC176528091921258",
            "status": "COMPLETED",
            "course_id": "693810d0a9eb27167f59df08",
            "transaction_id": "TXN-2e12a450-d8b2-4079-bc30-ab05bea3a1ef",
            "timestamp": "2025-12-09T15:11:14.779Z",
            "createdAt": "2025-12-09T15:11:14.780Z",
            "updatedAt": "2025-12-09T15:11:14.780Z",
            "__v": 0
        }
    ],
    "message": "Success",
    "success": true
  }
              
 ******************************************************************************************************************************************************             
  3.After SignUp or login as Learner
     **endrolledMent API
       url:http://localhost:5000/api/learner/enroll
       method:post
       body:(auto-send from frontend ,user not give any input)
          {
         "courseId":"69381254a9eb27167f59df27",
          "bankAccountNumber":"AC1765203487655476",
          "secretKey":"956b467e93ea"
          }
          response:
                {
      "statusCode": 201,
        "data": {
            "message": "Payment successful! Full access granted.",
            "transactionId": "693aea04c42b76fd246a2fe3"
         },
          "message": "Success",
           "success": true
        }
    **********************************************************************************************************************************************************

       3.0 show enrolled courses
            url:http://localhost:5000/api/learner/my-courses
            method:get
            response:
                             {
         "statusCode": 200,
        "data": [
        {
            "courseId": "693810d0a9eb27167f59df08",
            "title": "Operating System",
            "description": "Learn full Operatttting system from zero to hero",
            "price": 999,
            "instructorName": "Tarun Ghosh",
            "status": "Completed",
            "progress_percentage": 100,
            "enrolledAt": "2025-12-09T15:11:15.039Z"
        },
        {
            "courseId": "69381254a9eb27167f59df27",
            "title": "Database",
            "description": "Learn full databse from zero to hero",
            "price": 499,
            "instructorName": "Tarit Hasan",
            "status": "InProgress",
            "progress_percentage": 0,
            "enrolledAt": "2025-12-09T15:15:20.868Z"
        },
        {
            "courseId": "69380e2ca9eb27167f59defd",
            "title": "Data Scientist",
            "description": "Learn full data science from zero to hero",
            "price": 999,
            "instructorName": "Tarun Ghosh",
            "status": "InProgress",
            "progress_percentage": 0,
            "enrolledAt": "2025-12-09T15:37:42.124Z"
        }
        "message": "Success",
        "success": true
      }
   **************************************************************************************************************************************     
    ** have getContent option for each enrolled courses
              url:http://localhost:5000/api/learner/course/693810d0a9eb27167f59df08
              method:get
              response:
                                {
    "statusCode": 200,
    "data": {
        "course": {
            "_id": "693810d0a9eb27167f59df08",
            "title": "Operating System",
            "description": "Learn full Operatttting system from zero to hero",
            "instructor": {
                "_id": "69380bd7a9eb27167f59dee3",
                "fullName": "Tarun Ghosh"
            },
            "videos": [
                {
                    "title": "Intro",
                    "url": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765281998/hdxxzevmn6evhgm7wojr.mp4",
                    "duration_seconds": 120,
                    "_id": "693810d0a9eb27167f59df09",
                    "lastWatchedSeconds": 120,
                    "completed": true
                }
            ],
            "resources": []
        },
        "yourProgress": 67
    },
    "message": "Success",
    "success": true
   }
   ***********************************************************************************************************************************
          ** show progress of this courses and generate certificate if completed
             url:http://localhost:5000/api/learner/course/progress
             method:post
             body:(take from page user not input)
             {
               "courseId": "69381e1dda4cccdf1ab43b01",
               "videoId": "69399731b0d1c9ef939b4438",
               "currentTime":23,
               "completed": false
              }
              response:
                                 {
           "statusCode": 200,
          "data": {
           "message": "Progress updated",
        "progress": 100,
        "status": "Completed",
        "certificates_earned": [
            "6936c5b274811d0179082be9-693810d0a9eb27167f59df08-1765378388856",
            "6936c5b274811d0179082be9-69381e1dda4cccdf1ab43b01-1765441189773"
        ]
       },
      "message": "Success",
      "success": true
     }
   *****************************************************************************************************************************************
        3.1 show buyable courses(all courses without he/she enrolled)
            url:http://localhost:5000/api/learner/buyable-course
            method:get
            response:
                                          {
          "statusCode": 200,
    "data": [
        {
            "_id": "6935d063def7f6aa718b6e63",
            "title": "Full Stack Development",
            "description": "Learn full stack from zero to hero",
            "price": 499,
            "totalVideos": 3,
            "enrolledStudents": 0,
            "instructor": {
                "name": "Unknown fullname",
                "username": "Unknown username"
            },
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765134433/ykdh6i8t4adhk5erkwm4.mp4"
        },
        {
            "_id": "6936c80d74811d0179082c02",
            "title": "Full Stack Development",
            "description": "Learn full stack from zero to hero",
            "price": 499,
            "totalVideos": 1,
            "enrolledStudents": 0,
            "instructor": {
                "name": "Tanmoy Ghosh",
                "username": "tanmoy"
            },
            "thumbnail": "https://res.cloudinary.com/dl7deoszf/video/upload/v1765197836/aerkd7ujvf41svezaoxi.mp4"
        }
        "message": "Success",
        "success": true
        
     }
      
 
   
  *****************************************************************************************************************************************************    
  4. Admin
     **Show details about this LMS platform stats
       url:http://localhost:5000/api/admin/stats
       method:get
       response:
              {
    "statusCode": 200,
    "data": {
        "overview": {
            "totalCourses": 10,
            "totalLearners": 3,
            "totalInstructors": 4,
            "totalEnrollments": 5,
            "totalRevenue": 9577,
            "adminIncome": 1915.3999999999999,
            "platformCommission": "20%"
        },
        "monthlyRevenueChart": [
            {
                "month": "Jan 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Feb 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Mar 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Apr 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "May 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Jun 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Jul 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Aug 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Sep 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Oct 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Nov 2025",
                "revenue": 0,
                "enrollments": 0
            },
            {
                "month": "Dec 2025",
                "revenue": 817,
                "enrollments": 5
            }
        ],
        "lastUpdated": "2025-12-11T16:09:18.171Z"
    },
    "message": "Admin dashboard stats fetched successfully",
    "success": true
}
 ***********************************************************************************************************************************************************      
     **Show all transction with details
       url:http://localhost:5000/api/admin/transactions
       method:get
       response:
          {
    "statusCode": 200,
    "data": [
        {
            "transaction_id": "TXN-a4ac5d5c-2320-4bb5-b6c4-e949b49f1686",
            "type": "PURCHASE",
            "amount": 999,
            "status": "COMPLETED",
            "timestamp": "2025-12-11T15:57:56.364Z",
            "from_user": {
                "id": "6936c5b274811d0179082be9",
                "name": "Tk Ghosh",
                "username": "tk",
                "email": "taposhg522@gmail.com"
            },
            "from_account_number": "AC1765203487655476",
            "to_user": {
                "id": "69380bd7a9eb27167f59dee3",
                "name": "Tarun Ghosh",
                "username": "tarun",
                "email": "tarun@gmail.com"
            },
            "to_account_number": "AC176528091921258",
            "course": {
                "id": "693ae994c42b76fd246a2fcb",
                "title": "microproccessor"
            }
        },
        {
            "transaction_id": "TXN-2253de13-7291-4129-91f9-2969ba422aea",
            "type": "PURCHASE",
            "amount": 589,
            "status": "COMPLETED",
            "timestamp": "2025-12-10T16:00:40.198Z",
            "from_user": {
                "id": "6936c5b274811d0179082be9",
                "name": "Tk Ghosh",
                "username": "tk",
                "email": "taposhg522@gmail.com"
            }
            "message": "Page 1 transactions fetched",
            "success": true
         }
  **************************************************************************************************************************************************  
