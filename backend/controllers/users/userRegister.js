import User from "../../models/userModel.js";
import AppError from "../../error/appError.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

dotenv.config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

const register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, confirmationPassword } =
      req.body;

    if (password !== confirmationPassword) {
      return next(new AppError("Passwords don't match", 400));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError("User with this email already exists", 400));
    }

    const user = new User({
      firstname,
      lastname,
      email,
      password,
    });

    await user.save();

    transporter.sendMail(
      {
        to: [user.email],
        from: "dadeleyeadeitan@gmail.com",
        subject: "Verify your account",
        text: "Verify account",
        html: `
              <div>
                <h2>Hello ${user.firstname} ${user.lastname} we noticed you have just signed up for a free account.</h2>
                <p>Please follow this <a style={color: blue} href={https://github.com/doluwamu}>link</a> to verify your account</p>
              </div> 
            `,
      },
      (err, res) => {
        if (err) {
          return next(new AppError(`Couldn't send mail ---> ${err}`, 400));
        }

        console.log(res);

        return res.status(201).json({
          message: `We've sent a confirmation mail to this ${user.email}`,
          user,
        });
      }
    );
  } catch (error) {
    return next(error);
  }
};

export default register;

// .then(async (user) => {
//   console.log(user);
// await transporter.sendMail({
//   to: user.email,
//   from: "dadeleyeadeitan@gmail.com",
//   subject: "Verify your account",
//   html: `
//         <h2>Hello ${user.firstname} ${user.lastname} we noticed you have just signed up for a free account.</h2>
//         `,
// });
// })
// .then(() => {
// return res.status(201).json({
//   message: `We've sent a confirmation mail to this ${user.email}`,
//   user,
// });
// });

//    <div>
// <h2>Hello ${user.firstname} ${user.lastname} we noticed you have just signed up for a free account.</h2>
// <p>Please follow this <a href={github.com/doluwamu}>link</a> to verify your account</p>
// </div>
