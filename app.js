$(function(){

var state = {
  shoppingList: [
  ]
};

var recipeURL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search';
var ingredientsURL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes';

function getRecipes(searchTerm, allergies, typeOfCuisine, callback) {
    $.ajax({
      dataType: 'json',
      data: {fillIngredients: false, type: typeOfCuisine, query: searchTerm, limitLicense: false, intolerances: allergies, instructionsRequired: true, number: 10 },
      headers: {'X-Mashape-Key': 'cJ24Yr9MM7msh3pTbXdzd5aPo6SOp1u2f83jsnfzG9bKLnzvjz', 'Accept': 'application/json'},
      url: recipeURL,
      success: callback
    });
};

function getIngredients (identifier, callback) {
  $.ajax({
    dataType: 'json',
    data: {id: identifier, includeNutrition: false },
    headers: {'X-Mashape-Key': 'cJ24Yr9MM7msh3pTbXdzd5aPo6SOp1u2f83jsnfzG9bKLnzvjz', 'Accept': 'application/json'},
    url: (ingredientsURL + '/' + identifier + '/information'),
    success: callback
  });
};

function displaySearch(data) {
  var resultElement = "";
  data.results.forEach(function(item) {
    resultElement +=  '<div class="recipe-card col-sm-4" id="' + item.id + '">' +
    '<h6 class="recipe-title">' + item.title + '</h6>' +
    '<img class="results-img center-block" src="https://webknox.com/recipeImages/' + item.image + '">' +
    '<p>Ready in ' + item.readyInMinutes + ' minutes!</p>' +
    '<div class="recipe-card-actions center-block">' +
    '<button class="expand-ingredients btn btn-embossed btn-primary">See ingredients</button>' +
    '<button class="add-to-list btn btn-embossed btn-primary">Add recipe to shopping list</button>' +
    '</div>' +
    '<div class="ingredients-list" style="display: none;"><ul class="card-ingredients"></ul></div>' +
    '</div>'
  });
  $('.js-results').html(resultElement);
};

function displayIngredients(data) {
  var resultElement = "";
  var elementID = "#" + data.id;
  console.log(elementID);
  data.extendedIngredients.forEach(function(item) {
    resultElement += '<li class="ingredients-list-card">' +
    item.originalString + '</li>'
  });
  $(elementID).children().children('.card-ingredients').html(resultElement);
};

function showIngredients (element) {
    $(element).slideToggle('fast');
};

function addToList(data) {
  var ingredients = [];
  data.extendedIngredients.forEach(function(item) {
      ingredients.push(item.originalString);
  });
  state.shoppingList.push({
    name: data.title,
    items: ingredients,
    img: data.image,
    instructions: data.instructions
  });
  displaySelectedItem();
  console.log(data);
};

function removeFromList(itemName) {
  state.shoppingList.forEach(function(item) {
    if (item.name == itemName) {
      var index = state.shoppingList.indexOf(item);
      state.shoppingList.splice(index, 1);
    };
  });
  displaySelectedItem();
};

function displaySelectedItem() {
  resultElement = "";
  state.shoppingList.forEach(function(item){
    resultElement += '<li class="list-thumbnails">' +
    '<img class="recipe-thumbnail" src="' + item.img + '">' +
    '<h6 class="selected-item-title">' + item.name + '</h6>' +
    '<button class="remove-selected-item btn btn-danger">Remove Item</button>'
    '</li>'
  });
  $('.current-list').html(resultElement);
};

function displayShoppingList() {
  $('.search-container, .selected-recipes, .js-results').addClass('hidden');
  $('.shopping-list').removeClass('hidden');
  var resultElement = "";
  state.shoppingList.forEach(function(item) {
    var ingredientsHTML = "";
    item.items.forEach(function(item) {
      return ingredientsHTML += '<li class="ingredients-list"> <input type="checkbox" class="final-list-checkbox"><label for="checkbox">' + item + '</label></li>'
    });
    return resultElement += '<li class="list-item">' +
    '<h3>' + item.name + '</h3>' +
    '<ul>' + ingredientsHTML +
    '</ul>' +
    '<h5>Instructions: </h5>' +
    '<p>' + item.instructions + '</p>' +
    '</li>'
  });
  $('.final-shopping-list').html(resultElement);
};

$('.recipe-search-form').submit(function(e){
  e.preventDefault();
  var query = $('.js-query').val();
  var allergies = $('.js-allergies').val();
  var typeOfCuisine = $('#type-of-cuisine-dropdown').val();
  getRecipes(query, allergies, typeOfCuisine, displaySearch);
});

$('#results-div').on('click', '.expand-ingredients', function(event){
  event.preventDefault();
  var identifier = $(this).parent().parent().attr('id');
  var element = $(this).parent().siblings('.ingredients-list');
  $(this).attr("class", "retract-ingredients btn btn-embossed btn-primary").text("Hide Ingredients");
  $(this).parent().parent().toggleClass("open")
  getIngredients(identifier, displayIngredients);
  showIngredients(element);
});

$('#results-div').on('click', '.add-to-list', function(event){
  event.preventDefault();
  var identifier = $(this).parent().parent().attr('id');
  getIngredients(identifier, addToList);
});

$('#results-div').on('click', '.retract-ingredients', function(event) {
  $(this).parent().siblings('.ingredients-list').slideToggle('fast');
  $(this).attr("class", "expand-ingredients btn btn-embossed btn-primary").text("See Ingredients");
  $(this).parent().parent().toggleClass("open")
});

$('.selected-recipes').on('click', '.remove-selected-item', function(event) {
    var selectedItem = $(this).siblings('.selected-item-title').text();
    console.log(selectedItem);
    removeFromList(selectedItem);
});

$('.selected-recipes').on('click', '.generate-list-button', function(event) {
  displayShoppingList();
});

$('.shopping-list').on('click', '.edit-button', function(event) {
  $('.search-container, .selected-recipes, .js-results').removeClass('hidden');
  $('.shopping-list').addClass('hidden');
});

});
