var iM = require('../modules/instanceMan')

var allInstances = [
    {
        id : "api1",
        isTest : true,
        needs : ["$2","$3","$4"]
    },
     {
        id : "api2",
        isTest : true,
        needs : ["$5"],
        outputs : ["$2"]
    },
      {
        id : "api3",
        isTest : true,
        needs : ["$6","$7"],
        outputs : ["$3"]
    },
      {
        id : "api4",
        isTest : true,
        needs : ["$8","$9"],
        outputs : ["$4"]
    },
      {
        id : "api5",
        isTest : true,
        needs : ["$10"],
        outputs : ["$5"]
    },
      {
        id : "api6",
        isTest : true,
        needs : ["$10","$11"],
        outputs : ["$6","$6-1"]
    },
      {
        id : "api7",
        isTest : true,
        needs : ["$11-1","$12"],
        outputs : ["$7"]
    },
      {
        id : "api8",
        isTest : true,
        needs : ["$102"],
        outputs : ["$8"]
    },
      {
        id : "api9",
        isTest : true,
        needs : [],
        outputs : ["$9"]
    },
      {
        id : "api10",
        isTest : true,
        needs : ["$13","$14"],
        outputs : ["$10"]
    },
      {
        id : "api11",
        isTest : true,
        needs : ["$15","$101"],
        outputs : ["$11","$11-1"]
    },
      {
        id : "api12",
        isTest : true,
        needs : ["$16"],
        outputs : ["$12"]
    },
      {
        id : "api13",
        isTest : true,
        needs : ["$100"],
        outputs : ["$13"]
    },
      {
        id : "api14",
        isTest : true,
        needs : [],
        outputs : ["$14"]
    },
      {
        id : "api15",
        isTest : true,
        needs : ["$6-1"],
        outputs : ["$15"]
    },
      {
        id : "api16",
        isTest : true,
        needs : ["$15"],
        outputs : ["$16"]
    },


    {
        id : "api1000",
        isTest : true,
        needs : ["$999"],
        outputs : ["$1000"]
    },
{
        id : "api10001",
        isTest : true,
        needs : ["$1999"],
        outputs : ["$999"]
    },
{
        id : "api10002",
        isTest : true,
        needs : ["$10003"],
        outputs : ["$999"]
    },
{
        id : "api10003",
        isTest : true,
        needs : ["$10004"],
        outputs : ["$10003"]
    },
{
        id : "api10004",
        isTest : true,
        needs : [],
        outputs : ["$10004"]
    },
{
        id : "api10005",
        isTest : true,
        needs : ["$10006"],
        outputs : ["$999"]
    },
{
        id : "api10006",
        isTest : true,
        needs : [],
        outputs : ["$10006"]
    },


]

// iM.getInvokChain({
//         id : "api1",
//         isTest : true,
//         needs : ["$2","$3","$4"]
//     },allInstances,{},[]).then(chainObj =>{
//         console.log(chainObj)
//     })


// iM.getInvokChain({
//         id : "api4",
//         isTest : true,
//         needs : ["$8","$9"],
//         outputs : ["$4"]
//     },allInstances,{},[]).then(chainObj =>{
//         console.log(chainObj)
//     })

// iM.getInvokChain({
//         id : "api5",
//         isTest : true,
//         needs : ["$10"],
//         outputs : ["$5"]
//     },allInstances,{},[]).then(chainObj =>{
//         console.log(chainObj)
//     })



//    iM.getInvokChain( {
//         id : "api11",
//         isTest : true,
//         needs : ["$15","$101"],
//         outputs : ["$11","$11-1"]
//     },allInstances,{},[]).then(chainObj =>{
//         console.log(chainObj)
//     })

// iM.getInvokChain({
//         id : "api12",
//         isTest : true,
//         needs : ["$16"],
//         outputs : ["$12"]
//     },allInstances,{},[]).then(chainObj =>{
//         console.log(chainObj)
//     })
 


iM.getInvokChain({
        id : "api1000",
        isTest : true,
        needs : ["$999"],
        outputs : ["$1000"]
    },allInstances,{},[]).then(chainObj =>{
        console.log(chainObj)
    })
 

