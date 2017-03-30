using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Zlatka2._0.Models
{
    public class Training
    {
        public int id { get; set; }
        [AllowHtml]
        public string Content { get; set; }
        public string UserId { get; set; }
    }
}
