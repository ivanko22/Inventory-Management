const home = require("./controllers/home");

module.exports = function(app){
    app.get("/", home.displayInventory);
    app.get("/merchant/new", home.merchantSetup);
    app.get("/getrecipes", home.getRecipes);
    app.post("/merchant/create", home.createMerchant);
    app.post("/ingredients/create", home.createNewIngredients);
}