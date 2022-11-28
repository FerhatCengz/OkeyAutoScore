const firebaseConfig = {
  apiKey: "AIzaSyAzAG0a_ribj20DRAWaDNiw5B2wvtOcpYk",
  authDomain: "personid-9e533.firebaseapp.com",
  databaseURL: "https://personid-9e533-default-rtdb.firebaseio.com",
  projectId: "personid-9e533",
  storageBucket: "personid-9e533.appspot.com",
  messagingSenderId: "247603082330",
  appId: "1:247603082330:web:e71b378a57133300109463",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

let idKey = db.ref().child("/").push().key;

//Firebase her şeyi sil
const deleteAll = (columnName) => {
  db.ref(columnName + "/").on("value", (data) => {
    Object.keys(data.val()).forEach((e) => {
      db.ref(columnName + "/" + e).remove();
    });
  });
};
//Added !
const insert = (columnName, id, data) => {
  db.ref(columnName + "/" + id).set(data);
};

const playerName = () => {
  $("#es1th").text(localStorage.getItem("Es1"));
  $("#es2th").text(localStorage.getItem("Es2"));
};
playerName();

const playerScores = () => {
  $.ajax({
    type: "GET",
    url: `https://personid-9e533-default-rtdb.firebaseio.com/EsliOkey.json`,
    dataType: "json",
    success: function (response, { playerOneScore = 0, playerTwoScore = 0 }) {
      Object.keys(response).forEach((dataKeys) => {
        playerOneScore += Number(response[dataKeys].playerOne);
        playerTwoScore += Number(response[dataKeys].playerTwo);
      });

      $("#p1_score").text(playerOneScore);
      $("#p2_score").text(playerTwoScore);
    },
  });
};

//?Vue Instance
const app = Vue.createApp({
  data() {
    return {
      playerName: {
        input_Oyuncu1: "",
        input_Oyuncu2: "",
      },
      playerOne: 0,
      playerTwo: 0,
      objectData: {},
      playerScores: {
        playerTotalOne: 0,
        playerTotalTwo: 0,
      },
      updateInfo: {
        id: 0,
        upDatePlayerOneScore: 0,
        upDatePlayerTwoScore: 0,
      },
    };
  },
  mounted() {
    //!Verileri Aktar
    const dataList = (columnName) => {
      db.ref(columnName).on("value", (data) => {
        this.objectData = data.val();
      });
    };
    dataList("EsliOkey");

    const interval = setInterval(() => {
      if (this.objectData.length > 0) {
        clearInterval(interval);
      }
    }, 100);
    playerScores();
  },
  beforeUpdate() {
    playerScores();
  },
  methods: {
    userSave() {
      localStorage.setItem("Es1", this.playerName.input_Oyuncu1);
      localStorage.setItem("Es2", this.playerName.input_Oyuncu2);
      playerName();
    },
    removeAllData() {
      Swal.fire({
        title: "Verilere Silmeye Emin misin ?",
        showCancelButton: false,
        confirmButtonText: "Evet Eminim",
        denyButtonText: `Hayır Kalsın`,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAll("EsliOkey");
          Swal.fire("Silindi!", "", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    },
    scoreSave() {
      const id = new Date().getTime();
      insert("EsliOkey", id, { id: id, playerOne: Number(this.playerOne), playerTwo: Number(this.playerTwo) });
      this.playerScores.playerTotalOne += this.playerOne;
    },
    updateScore(data) {
      this.updateInfo.id = data;
      db.ref(`EsliOkey/${data}`).on("value", (getData) => {
        this.updateInfo.upDatePlayerOneScore = getData.val()["playerOne"];
        this.updateInfo.upDatePlayerTwoScore = getData.val()["playerTwo"];
      });
    },
    updateSave() {
      db.ref(`EsliOkey/${this.updateInfo.id}`).set({ id: this.updateInfo.id, playerOne: this.updateInfo.upDatePlayerOneScore, playerTwo: this.updateInfo.upDatePlayerTwoScore });
    },
  },
}).mount("#app");

// EsliOkey
