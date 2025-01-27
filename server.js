const express = require("express");
const cors = require("cors");
const validator = require("email-validator");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const booking = req.body;
  const currentId = bookings.length;
  const newBookingObj = {
    id: currentId,
    title: booking.title,
    firstName: booking.firstName,
    surname: booking.surname,
    email: booking.email,
    roomId: currentId,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
  };
  //validation
  const emailValid = validator.validate(req.body.email);
  if (Object.values(newBookingObj).includes(undefined)) {
    res.status(400).send("missing data in request body.");
  }else if(!emailValid){
    res.status(400).send("Invalid email");
  } else {
    //booking is valid
    bookings.push(newBookingObj);
    res.send("added new booking");
  }
});

app.get("/bookings/search?", (req, res) => {
  //I'm  unsure how to span a between dates when the user only 
  //puts in one date.
  
  //so for now this just returns any bookings that contain the
  //date that was searched (be it check in or check out).
  const foundBookings = bookings.filter(
    (booking) =>
      booking.checkInDate === req.query.date ||
      booking.checkOutDate === req.query.date
  );
  res.json(foundBookings);
});

app.get("/bookings/:id", (req, res) => {
  const foundById = bookings.find((booking) => booking.id == req.params.id);
  if (foundById === undefined) {
    res.status(404).send("could not find a booking matching the provided ID.");
  } else {
    res.json(foundById);
  }
});

app.delete("/bookings/:id", (req, res) => {
  const foundById = bookings.find((booking) => booking.id == req.params.id);
  if (foundById === undefined) {
    res.status(404).send("could not find a booking matching the provided ID.");
  } else {
    bookings = bookings.filter((booking) => booking.id != req.params.id);
    res.send(`deleted booking with id of ${req.params.id}`);
  }
});



//commented out for debugging - for some reason the port was random with every save
// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

app.listen(5000, () => {
  console.log("listening on port 5000");
});
