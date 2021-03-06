//const fetch = require('node-fetch');
let timeIn;
let timeOut;
let usersn;
document.addEventListener("DOMContentLoaded", () => {
  //fetch data from local api
  //filterUsers().then((data) => console.log(data));
  fetchData().then((data) => {
    renderUsers(data);
    clockOutTime(data);
    appendTimestamp(data);
  });

  let clockIn = document.getElementById("clock-in");

  clockIn.addEventListener("click", () => {
    clockInTime();
  });
});
//get DOM elements
let clockOut = document.getElementById("clock-out");
let usersList = document.getElementById("list-results");
let userTitle = document.getElementById("title");
let userDesignation = document.getElementById("designation");
let userId = document.getElementById("id");
let userEmail = document.getElementById("user-email");
let timeStampList = document.getElementById("timestamp-results");
let avatarImg = document.getElementById("avatar-img");

//async funtion to fetch data from local json
async function fetchData() {
  const users = await fetch("http://localhost:3000/users");
  return users.json();
}
//gets random avater images for employees
async function getAverters() {
  const users = await fetch("https://randomuser.me/api/");
  return users.json();
}
//apend random image to employee profile
function updateProf(profile) {
  avatarImg.src = profile.results[0].picture.large;
}
//render users to list with event listners to apend selected user details
function renderUsers(users) {
  users.forEach((users) => {
    let list = document.createElement("li");

    list.innerText = users.name;
    usersList.style.listStyle = "none";
    usersList.appendChild(list);

    //render spefic movie details
    list.addEventListener("click", () => {
      userTitle.textContent = users.name;
      userDesignation.textContent = users.designation;
      userId.textContent = users.id;
      userEmail.textContent = users.email;
      //getAverters().then((data) => console.log(data));
      //avatar.src = getAverters().then((data) => data.results[0].picture.medium);
      getAverters().then((data) => updateProf(data));
      timeStampList.innerHTML = "";
      appendTimestamp(users);

      //timeStampList.reload();
    });
  });
}
function appendTimestamp(users) {
  for (let i in users.timestamp) {
    let li = document.createElement("li");
    li.className = "timestamps-list";
    li.innerHTML = users.timestamp[i];
    timeStampList.appendChild(li);
  }
}

//function retuns clock in timestamp
function clockInTime() {
  timeIn = new Date();
  return timeIn;
}

//funtion returns clock out timestamp and POSTS TO datadase to updated timestamp
function clockOutTime(users) {
  timeOut = new Date();

  clockOut.addEventListener("click", (event) => {
    for (let data of users) {
      if (userId.innerText === data.id) {
        const index = users.indexOf(data);
        let upDateInfo = {};

        function upDateStamp() {
          let newtimestamp = [
            `${timeIn.toGMTString()} - ${timeOut.toGMTString()}`,
          ];
          var newt = [[...newtimestamp]];

          //          newt[0].push(newtimestamp);

          //console.log(newtimestamp);
          upDateInfo = {
            id:users.id,
            timestamp: [...newt],
          };
        }

        upDateStamp();

        //console.log(newVotes)

        fetch(`http://localhost:3000/users/${index + 1}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(upDateInfo),
        })
          .then((res) => res.json())
          .then((users) => {
            //console.log(users)
            // calSalary(users);
            appendTimestamp(users);
          })
          .catch(function () {});
      } else {
      }
    }
  });
}
//search user funtion
const searchBar = document.getElementById("search-form");

searchBar.addEventListener("submit", (event) => {
  event.preventDefault();

  usersList.innerHTML = "";
  let str = document.getElementById("search-str");
  letter = str.value;
  filterUsers(letter).then((data) => renderUsers(data));
});

async function filterUsers(str) {
  const users = await fetch(`http://localhost:3000/users?name_like=${str}`);
  return users.json();
}
