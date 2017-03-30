using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Zlatka2._0.Models;

namespace Zlatka2._0.Controllers
{
    public class TrainingController : Controller
    {
        private TrainingContext db = new TrainingContext();
        private ApplicationDbContext appdb = new ApplicationDbContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult LoadTraining()
        {
            string userId = this.User.Identity.GetUserId();
            int trainingId = (from t in db.Trainings where t.UserId == userId select t.id).FirstOrDefault();

            if (trainingId != 0)
            {
                Training training = db.Trainings.Find(trainingId);
                return Json(training.Content);
            }
            return Json(null);
        }

        [HttpPost]
        public JsonResult SaveTraining(string content)
        {
            string userId = this.User.Identity.GetUserId();

            if (userId == null)
            {
                return Json("Can't save. User is not logined.");
            }

            int trainingId = (from t in db.Trainings where t.UserId == userId select t.id).FirstOrDefault();

            if (trainingId != 0)
            {
                db.Trainings.Find(trainingId).Content = content;
            }
            else
            {
                Training training = new Training { Content = content, UserId = userId };
                db.Trainings.Add(training);
            }
            db.SaveChanges();

            return Json("Saved");
        }

    }
}