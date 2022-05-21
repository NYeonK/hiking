// chat-bot

 const express = require('express');
 const router = express.Router();
// const structjson = require('./structjson.js');
 const dialogflow = require('dialogflow');
// const uuid = require('uuid');
// const config = require('../dev');
// 
// const projectId = config.googleProjectID
// const sessionId = config.dialogFlowSessionID
// const languageCode = config.dialogFlowSessionLanguageCode
// 
// 
// // Create a new session
// const sessionClient = new dialogflow.SessionsClient();
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);
// 
// 
// // Text Query Route
// // 텍스트쿼리 - /api/dialogflow/textQuery
// router.post('/textQuery', async (req, res) => {
// 
//     //client에서 받은 정보를 Dialogflow에 보내줌
//     const request = {
//         session: sessionPath,
//         queryInput: {
//             text: {
//                 text: req.body.text,
//                 languageCode: languageCode,
//             },
//         },
//     };
// 
//     const responses = await sessionClient.detectIntent(request);
//     console.log('Detected intent');
//     const result = responses[0].queryResult;
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);
// 
//     res.send(result)
// })
// 
// 
// 
// // Event Query Route
// // 이벤트쿼리 - /api/dialogflow/eventQuery
// 
// router.post('/eventQuery', async (req, res) => {
//     const request = {
//         session: sessionPath,
//         queryInput: {
//             event: {
//                 name: req.body.event,
//                 languageCode: languageCode,
//             },
//         },
//     };
// 
//     const responses = await sessionClient.detectIntent(request);
//     console.log('Detected intent');
//     const result = responses[0].queryResult;
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);
// 
//     res.send(result)
// })
// 
// 

module.exports = router;
