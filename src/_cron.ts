import cron from "node-cron";
import { cancelUnpaidAppointments } from "@/app/modules/appointment/appointment.service";

cron.schedule("* * * * *", () => {
  try {
    console.log("Node cron called at ", new Date());
    cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});
