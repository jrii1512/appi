import { Context, send } from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import * as itemServices from "../../services/itemService.js";
import { renderFile } from "../../deps.js";
import { ensureDir, ensureFile, ensureFileSync } from "https://deno.land/std/fs/mod.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import { getIP } from "https://deno.land/x/get_ip/mod.ts";
import { readLines } from "https://deno.land/std/io/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import { IPLocationService } from "https://deno.land/x/location/iplocationservice.ts"
import { CityLocationService } from "https://deno.land/x/location/citylocationservice.ts"
import { open } from "https://deno.land/x/opener/mod.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";

const pvm = () => {
    var temp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    var tDate = temp.replace(" ", "_").replace(":", "");
    console.log("Dataa tiedostoon logs/appi_logs_" + tDate + ".log");
}



var log = [];

const showLocation = async (request, response) =>{

    console.log("showLocation, opening ip.html from ../");
    console.log("current location " + Deno.cwd());
    if(existsSync("./ip.html"))
    {
        console.log("File ip.html found, trying to open it");
    try{
        await open("https://getone-7.herokuapp.com/ip.html")
    }
    catch (e){
        console.error(e);
    }
    }
}
/*
    var myLat;
    var myLong;
    var locStr;
    console.log("nav: " + navigator.geolocation);
    if (navigator.geolocation != undefined) {
        console.log("navigator.geolocation")
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLong = position.coords.longitude;
            console.log("latitude: " + myLat);
            console.log("longitude: "  + myLong);
            locStr = "<iframe style=\"width: 400px; height: 400px\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"//maps.google.com/?ll=" + mylat + "," + mylong + "&z=16&output=embed\"></iframe>";
        });
        response.body = await renderFile('../views/location.eta', {
            ip: locStr,
        });

      } else {
        response.body = await renderFile('../views/location.eta', {
            ip: "navigator.geolocation returns undefined",
        });
      }
    }
*/



const showMain = async ({ response }) => {
    var ip = await getIP({ ipv6: true });
    console.log(ip);
    const ipLocation = await IPLocationService.getIPLocation(ip);
    const region = ipLocation.region_name;
    console.log(region);


    response.body = await renderFile('../views/start.eta', {
        //ip: locStr,
        ip: await getIP({ ipv6: true }),
        loc: region,
    });
};


const addIdea = async ({ request, response }) => {
    try {
        console.log("Idean lisäys");
        const body = request.body();
        const formData = await body.value;
        const idea = formData.get("toive").trim();
        const esittaja = formData.get("esittaja").trim();
        var ideaStatus = Boolean(true);
        var orderStatus = Boolean(false);
        var deliveredStatus = Boolean(false);
        console.log('itemController -> ' + idea + ", " + esittaja + ",ideaStatus-> " + ideaStatus, " ,orderStatus->" + orderStatus + ", deliveredStatus->" + deliveredStatus);
        await itemServices.addIdea(idea, esittaja, ideaStatus, orderStatus, deliveredStatus);
        response.redirect('/ideas');
        const note = new Date() + " " + idea + " added.";
        log.push(note);

        console.log("notena -> " + note);

        loggaus(log);

    }
    catch (err) {
        const note = new Date() + "_error: " + err;
        log.push(note);
        loggaus();
    }
};

const getIdeas = async ({ response }) => {
    response.body = await renderFile("../views/ideas.eta", {
        ideas: await itemServices.fetchIdeas(),
    });
};

const getOrders = async ({ params, response }) => {
    console.log("itemController, getOrders -> params.id = " + params.id);
    response.body = await renderFile("../views/orders.eta", {
        ordered: await itemServices.fetchOrders(params.id),
    });
};

const getDelivered = async ({ params, response }) => {
    console.log("itemController, getDelivered -> params.id = " + params.id);
    response.body = await renderFile("../views/delivered.eta", {
        deliveries: await itemServices.fetchDelivered(params.id),
    });
};

const doDelete = async ({ response }) => {
    console.log("itemController, doDelete");
    response.body = await renderFile('../views/index.eta', {
        deleteResp: await itemServices.deleteAll(),
    });
}

const showLogFile = async ({ response }) => {
    console.log("itemController, showLogFile")
    const data = await Deno.readTextFile("logs/appi_logs.log")
    console.log(data)
    response.body = await renderFile('../views/logReader.eta', {
        content: data,
        newLine: "\n",
    });
}


const loggaus = async (log) => {
    console.log("loggaus funktioata kutsuttu")
    ensureDir("./logs")
        .then(() => {

            let location = "./logs/appi_logs.log";

            for (let i of log) {
                console.log(i);
                Deno.writeTextFile(location, i + "\n\n", { "append": true });
            }

        });
    console.log("Logs hakemistossa on yksityiskohdat ideoiden lisäämistä.");
}




export { showMain, getIdeas, getOrders, getDelivered, addIdea, doDelete, showLogFile, pvm, loggaus, showLocation };



