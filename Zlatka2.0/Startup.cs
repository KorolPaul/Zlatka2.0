using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Zlatka2._0.Startup))]
namespace Zlatka2._0
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            

            ConfigureAuth(app);
        }
    }
}
