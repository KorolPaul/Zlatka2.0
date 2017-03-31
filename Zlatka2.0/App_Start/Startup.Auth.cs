﻿using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using Zlatka2._0.Models;

namespace Zlatka2._0
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context, user manager and signin manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                        validateInterval: TimeSpan.FromMinutes(30),
                        regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                }
            });            
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            /*
            app.UseTwitterAuthentication(
               consumerKey: "VWJdeXqJs2VlCfdjZ6zxmC78V",
               consumerSecret: "GoIefOGl1rli5oHWuTL3tVyUAj3iYjGAPcumLY7d86QaMKp0Pn");

            app.UseFacebookAuthentication(
               appId: "430984943907246",
               appSecret: "899bbd99cd49a729a278d02b7c69323d");

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "718632715664-7bmj1p4ttman992j00q0uk5icjqoclvk.apps.googleusercontent.com",
                ClientSecret = "e41osfr0kgMlr60GaqLDEjSQ"
            });
            */

            app.UseTwitterAuthentication(
               consumerKey: "xQXblX2IYD5p5wIvNEzScKCQt",
               consumerSecret: "2TjcCcaeLbliLjnbP6TSGgpxdSM5dsBhAAvCZyamMwacS7TB0m");

            app.UseFacebookAuthentication(
               appId: "1936753826556706",
               appSecret: "100252a22b7e4bd9d62d9f334be88bdd");

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "718632715664-7bmj1p4ttman992j00q0uk5icjqoclvk.apps.googleusercontent.com",
                ClientSecret = "jnkwZ9bzE7UNsAz6INSQkzP3"
            });
        }
    }
}