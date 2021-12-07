
document.querySelectorAll("#main .nav .button")[0].classList.toggle("sel", true);
document.querySelectorAll("#main .nav .button")[1].classList.toggle("sel", false);

document.querySelectorAll("#main .nav .button")[0].onclick = e => {
    document.querySelectorAll("#main .tab")[0].style.transform = "translateX(0)";
    document.querySelectorAll("#main .tab")[1].style.transform = "translateX(100%)";
    document.querySelectorAll("#main .nav .button")[0].classList.toggle("sel", true);
    document.querySelectorAll("#main .nav .button")[1].classList.toggle("sel", false);
};

document.querySelectorAll("#main .nav .button")[1].onclick = e => {
    document.querySelectorAll("#main .tab")[0].style.transform = "translateX(-100%)";
    document.querySelectorAll("#main .tab")[1].style.transform = "translateX(0)";
    document.querySelectorAll("#main .nav .button")[0].classList.toggle("sel", false);
    document.querySelectorAll("#main .nav .button")[1].classList.toggle("sel", true);
};

document.querySelectorAll("#main .add")[0].onclick = e => {
    addActivity();
};

document.querySelectorAll("#activity .cancel")[0].onclick = e => {
    cancelActivity();
}

document.querySelectorAll("#activity .save")[0].onclick = e => {
    saveActivity();
}

document.querySelectorAll("#activity .delete")[0].onclick = e => {
    deleteActivity();
}

document.querySelectorAll("#activity select")[0].onchange =
document.querySelectorAll("#activity input")[0].onchange =
document.querySelectorAll("#activity input")[1].onchange =
document.querySelectorAll("#activity input")[2].onchange = e => {
    updateActivitySave();
}

document.querySelectorAll("#friend .back")[0].onclick = e => {
    document.querySelector("#friend").classList.toggle("hidden", true);
};

activities = [
    // {
    //     title: "Play video games",
    //     showTo: "all",
    //     start: "2021-12-06T18:00",
    //     end: "2021-12-06T20:00"
    // },
    // {
    //     title: "Watch a movie",
    //     showTo: "close",
    //     start: "2021-12-06T20:30",
    //     end: "2021-12-06T23:00"
    // }
];

friends = [
    {
        name: "Kevin",
        activities: [
            {
                title: "Watch a movie",
                start: "2021-12-06T21:00",
                end: "2021-12-06T23:30"
            }
        ]
    },
    {
        name: "Maddy",
        activities: [
            {
                title: "Work on homework",
                start: "2021-12-06T12:00",
                end: "2021-12-06T14:00"
            },
            {
                title: "Play video games",
                start: "2021-12-06T17:00",
                end: "2021-12-06T19:45"
            },
            {
                title: "Watch a movie",
                start: "2021-12-06T20:30",
                end: "2021-12-06T23:30"
            }
        ]
    },
    {
        name: "Theo",
        activities: [
            {
                title: "Watch a movie",
                start: "2021-12-06T13:00",
                end: "2021-12-06T15:30"
            },
            {
                title: "Get something to eat",
                start: "2021-12-06T17:00",
                end: "2021-12-06T19:00"
            }
        ]
    },
    {
        name: "Toby",
        activities: [
            {
                title: "Work on homework",
                start: "2021-12-06T13:00",
                end: "2021-12-06T15:30"
            },
            {
                title: "Get something to eat",
                start: "2021-12-06T17:00",
                end: "2021-12-06T19:00"
            }
        ]
    }
];

updateActivityDisplay();

function isMatch(my, other) {
    let nameFactor = stringSimilarity.compareTwoStrings(my.title, other.title);
    if(nameFactor > 0.66 || (my.title.toLowerCase().indexOf("game") !== -1 && other.title.toLowerCase().indexOf("game") !== -1) || (my.title.toLowerCase().indexOf("movie") !== -1 && other.title.toLowerCase().indexOf("movie") !== -1) || (my.title.toLowerCase().indexOf("eat") !== -1 && other.title.toLowerCase().indexOf("eat") !== -1)) {
        let a_start = new Date(my.start);
        let a_end = new Date(my.end);
        let b_start = new Date(other.start);
        let b_end = new Date(other.end);

        // check for overlap
        if((a_start <= b_start && b_start <= a_end)
            || (a_start <= b_end && b_end <= a_end)
            || (b_start < a_start && a_end < b_end)) return true;
    }
    return false;
}

updateFriendsDisplay();

function updateActivityDisplay() {

    let anyMatches = false;
    a: for(f in friends) {
        for(a in friends[f].activities) {
            for(a2 in activities) {
                console.log(a.title + " " + a2.title);
                if(isMatch(friends[f].activities[a], activities[a2])) {
                    anyMatches = true;
                    break a;
                }
            }
        }
    }

    document.querySelectorAll("#main .nav .button")[1].innerText = "Friends" + (anyMatches ? " (!)" : "");

    let list = document.querySelectorAll("#main .activityList")[0];
    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }

    activities.forEach((e, i) => {
        console.log(i + " " + e);
        let div = document.createElement("div");

        let title = document.createElement("div");
        title.innerText = e.title;
        div.appendChild(title);

        let show = document.createElement("div");
        show.innerText = "With " + e.showTo + " friends";
        div.appendChild(show);

        let time = document.createElement("div");
        time.innerText = "From " + new Date(e.start).toLocaleString() + "\n to " + new Date(e.end).toLocaleString();
        div.appendChild(time);

        div.classList.add("entry");
        div.onclick = e => {
            editActivity(i);
        }
        list.appendChild(div);
    });

    document.querySelectorAll("#main .noActivities")[0].style.display = activities.length == 0 ? "block" : "none";

}

function updateFriendsDisplay() {
    let list = document.querySelectorAll("#main .friendsList")[0];
    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }

    friends.forEach((e, i) => {
        console.log(i + " " + e);
        let div = document.createElement("div");

        let title = document.createElement("div");
        title.innerText = e.name;
        div.appendChild(title);

        let show = document.createElement("div");
        show.innerText = "Looking to:\n" + e.activities.map(a => a.title).join("\n");
        div.appendChild(show);

        div.classList.add("entry");

        a: for(a in e.activities) {
            for(a2 in activities) {
                console.log(a.title + " " + a2.title);
                if(isMatch(e.activities[a], activities[a2])) {
                    div.classList.add("exc");
                    break a;
                }
            }
        }

        div.onclick = e => {
            showFriend(i);
        }
        list.appendChild(div);
    });

}

function showFriend(index) {
    document.querySelectorAll("#friend .title div")[0].innerText = friends[index].name + " wants to:";
    let list = document.querySelectorAll("#friend .list")[0];
    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }

    friends[index].activities.forEach((e, i) => {
        console.log(i + " " + e);
        let div = document.createElement("div");

        let title = document.createElement("div");
        title.innerText = e.title;
        div.appendChild(title);

        let show = document.createElement("div");
        show.innerText = "From " + new Date(e.start).toLocaleString() + "\n to " + new Date(e.end).toLocaleString();
        div.appendChild(show);

        div.classList.add("entry");

        for(a2 in activities) {
            console.log(a.title + " " + a2.title);
            if(isMatch(e, activities[a2])) {
                div.classList.add("exc");
                break;
            }
        }

        div.onclick = e => {
            alert("(unimplemented) There would be a popup here with links to this friend's connected accounts so you can message them.")
        }
        list.appendChild(div);
    });

    document.querySelector("#friend").classList.toggle("hidden", false);
}

editing = -1;

function addActivity() {
    editing = -1;
    document.querySelectorAll("#activity select")[0].value = "all"
    document.querySelectorAll("#activity input")[0].value = "";
    document.querySelectorAll("#activity input")[1].value = "";
    document.querySelectorAll("#activity input")[2].value = "";
    updateActivitySave();
    document.querySelectorAll("#activity .header .title div")[0].innerText = "Add Activity";
    document.querySelectorAll("#activity .delete")[0].style.display = "none";
    document.querySelectorAll("#activity")[0].classList.toggle("hidden", false);
}

function editActivity(index) {
    document.querySelectorAll("#activity select")[0].value = activities[index].showTo;
    document.querySelectorAll("#activity input")[0].value = activities[index].title;
    document.querySelectorAll("#activity input")[1].value = activities[index].start;
    document.querySelectorAll("#activity input")[2].value = activities[index].end;
    editing = index;
    updateActivitySave();
    document.querySelectorAll("#activity .header .title div")[0].innerText = "Edit Activity";
    document.querySelectorAll("#activity .delete")[0].style.display = "flex";
    document.querySelectorAll("#activity")[0].classList.toggle("hidden", false);
}

function updateActivitySave() {
    document.querySelectorAll("#activity .save")[0].classList.toggle("disabled", !isValidActivityInput());
}

function isValidActivityInput() {
    return document.querySelectorAll("#activity input")[0].value !== ""
    && document.querySelectorAll("#activity input")[1].value !== ""
    && document.querySelectorAll("#activity input")[2].value !== "";
}

function saveActivity() {
    if(isValidActivityInput()) {
        document.querySelectorAll("#activity")[0].classList.toggle("hidden", true);
        if(editing !== -1) {
            activities[editing].showTo = document.querySelectorAll("#activity select")[0].value;
            activities[editing].title = document.querySelectorAll("#activity input")[0].value;
            activities[editing].start = document.querySelectorAll("#activity input")[1].value;
            activities[editing].end = document.querySelectorAll("#activity input")[2].value;
            updateActivityDisplay();
            updateFriendsDisplay();
        } else {
            let n = {};
            n.showTo = document.querySelectorAll("#activity select")[0].value;
            n.title = document.querySelectorAll("#activity input")[0].value;
            n.start = document.querySelectorAll("#activity input")[1].value;
            n.end = document.querySelectorAll("#activity input")[2].value;
            activities.push(n);
            updateActivityDisplay();
            updateFriendsDisplay();
        }
    }
}

function cancelActivity() {
    document.querySelectorAll("#activity")[0].classList.toggle("hidden", true);
}

function deleteActivity() {
    if(editing !== -1 && confirm("Are you sure you want to delete this activity?")) {
        activities.splice(editing, 1);
        updateActivityDisplay();
        updateFriendsDisplay();
        document.querySelectorAll("#activity")[0].classList.toggle("hidden", true);
    }
}

detectSwipe(document.querySelectorAll("#main")[0], (el, dir) => {
    if(!el.classList.contains("entry") && !el.parentNode.classList.contains("entry")) {
        if(dir === "left") {
            document.querySelectorAll("#main .tab")[0].style.transform = "translateX(-100%)";
            document.querySelectorAll("#main .tab")[1].style.transform = "translateX(0)";
        } else if(dir === "right") {
            document.querySelectorAll("#main .tab")[0].style.transform = "translateX(0)";
            document.querySelectorAll("#main .tab")[1].style.transform = "translateX(100%)";
        }
    }
});

function detectSwipe(el, func, deltaMin = 90) {
    const swipe_det = {
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0,
      time: 0
    }
    // Directions enumeration
    const directions = Object.freeze({
      UP: 'up',
      DOWN: 'down',
      RIGHT: 'right',
      LEFT: 'left'
    })
    let direction = null
    el.addEventListener('touchstart', function(e) {
      const t = e.touches[0]
      swipe_det.sX = t.screenX
      swipe_det.sY = t.screenY
      swipe_det.time = new Date().getTime();
    }, false)
    el.addEventListener('touchmove', function(e) {
      // Prevent default will stop user from scrolling, use with care
      // e.preventDefault();
      const t = e.touches[0]
      swipe_det.eX = t.screenX
      swipe_det.eY = t.screenY
    }, false)
    el.addEventListener('touchend', function(e) {
      const deltaX = swipe_det.eX - swipe_det.sX
      const deltaY = swipe_det.eY - swipe_det.sY
      // Min swipe distance, you could use absolute value rather
      // than square. It just felt better for personnal use
      if (deltaX ** 2 + deltaY ** 2 < deltaMin ** 2) return
      if (new Date().getTime() - swipe_det.time > 1000) return
      // horizontal
      if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
        direction = deltaX > 0 ? directions.RIGHT : directions.LEFT
      else // vertical
        direction = deltaY > 0 ? directions.UP : directions.DOWN
  
      if (direction && typeof func === 'function') func(e.target, direction)
  
      direction = null
    }, false)
}