// ****** GRAB ITEMS **********
const alert = document.querySelector('.alert');
const groceryForm = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const groceryContainer = document.querySelector('.grocery-container');
const groceryList = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

//  Edit Option
let editElement;
let editFlag = false;
let editId = '';

// ****** EVENT LISTENERS **********
groceryForm.addEventListener('submit', addGroceryItem);

clearBtn.addEventListener('click', clearList);

//  Load list from local storage every time we refresh page
window.addEventListener('DOMContentLoaded', setUpItems);


// ****** FUNCTIONS **********
function addGroceryItem(e)
{
  /**
   * First We prevent the form from submitting
   * Then we grab the value and generate a new id
   * Then we create a new element for the grocery item
   * Give it an id and append it to the list
   * Then Add the class to show the container to the grocery container
   */

  e.preventDefault();

  const value = grocery.value;
  const id = new Date().getTime().toString();

  //  1st Condition: If the value is not empty and we are not editing
  if (value && !editFlag)
  {
    createGroceryItem(id, value);

    //  Display alert
    displayAlert("Successfully Added Item", "success");

    //  Show the grocery Container
    groceryContainer.classList.add("show-container");

    //  Add To local Storage
    addToLocalStorage(id, value);

    //  Set BACK To Default
    setBackToDefault();
  }
  //  2nd Condition: If the value is not empty and we are editing
  else if (value && editFlag)
  {
    editElement.innerHTML = value;
    displayAlert("Successfully Edited Item", "success");

    //  Edit Local Storage
    editLocalStorage(editId, value);

    setBackToDefault();
  }
  //  3rd Condition: anything else
  else
  {
    displayAlert("Please Enter A Value", "danger")
  }
}


function createGroceryItem(id, value)
{
  /**
   * Function to create new grocery Items and add them to the grocery list
   * First We create an element, give it a data-id attribute equal to the id
   * Add event listeners to the edit and delete buttons
   * Then append the item to the grocery list
   */
  const element = document.createElement('article');
  element.className = 'grocery-item';

  //  Create an attribute and set its value equal to the id
  const attr = document.createAttribute('data-id');
  attr.value = id;

  element.setAttributeNode(attr);

  element.innerHTML = 
  `
  <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;

  //  Add Event Listeners To The Edit And Delete Buttons
  const editBtn = element.querySelector('.edit-btn');
  const deleteBtn = element.querySelector('.delete-btn');

  editBtn.addEventListener('click', editGroceryItem);
  deleteBtn.addEventListener('click', deleteGroceryItem);

  //  Append the grocery Item to the Grocery List
  groceryList.appendChild(element);
}

function editGroceryItem(e)
{
  /**
   * editGroceryItem - edit a grocery item and also update the local storage
   * First we get the particular element of the button
   * Then we set edit element to that list item
   * we set the input value equal to the value of the list item
   * edit flag = true
   * then edit id = id of the list item
   * submitBtn's text content is set to edit
   */
  const item = e.currentTarget.parentElement.parentElement;

  //  Setting the editElement valraible equal to the text of the list item
  editElement = e.currentTarget.parentElement.previousElementSibling;

  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = item.dataset.id;
  submitBtn.textContent = 'edit';
}

function deleteGroceryItem(e)
{
  /**
   * deleteGroceryItem - removes a particular item from the groery list
   * First we grab hold of the item belonging to the particular button clicked
   * Then we remove it from the grocery list
   * If the list is empty, we hide it
   * then we display an alert
   * then we set back to defaults
   * then remove from the local storage
   */
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;

  groceryList.removeChild(item);

  if (groceryList.children.length === 0)
  {
    groceryContainer.classList.remove('show-container');
  }

  displayAlert("Removed Item", "danger");

  setBackToDefault();

  //  Remove from Local Storage
  removeFromLocalStorage(id);
}


//  Display Alert Function
function displayAlert(text, condition)
{
  /**
   * displayAlert  - displays the text alert, 
   * with the given condition, either success or danger
   * Gets rid of the alert after given number of seconds
   */

  alert.textContent = text;
  alert.classList.add(`alert-${condition}`);

  setTimeout(()=> {
    alert.textContent = '';
    alert.classList.remove(`alert-${condition}`);
  },1000);
}

function setBackToDefault()
{
  /**
   * setBackToDefault - Resets the global variables and form input back to normal
   */
   grocery.value = '';
   editFlag = false;
   editId = '';
   submitBtn.textContent = 'Add';
}

//  Function to clear list
function clearList()
{
  /**
   * clearList - removes all items from the grocery list
   * First we get all elements inside the list
   * Then we check if the list is empty
   * if not, we remove all elements from it
   * Then we display an alert message
   * Set Back To Defaults
   * then remove the list from local storage
   */
  const groceryItems = document.querySelectorAll('.grocery-item');
  
  if(groceryItems.length > 0)
  {
    groceryItems.forEach((item) => {
      groceryList.removeChild(item);
    });
  }

  groceryContainer.classList.remove('show-container');
  displayAlert("Emptied List", "danger");
  setBackToDefault();

  //  Remove from local storage
  localStorage.removeItem('list');
}


// ****** LOCAL STORAGE **********

function getLocalStorage()
{
  /**
   * Checks wether the local storage is empty
   * if yes - it returns an empty list
   * if no - then it returns the list of objects in the local storage 
   */

  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function addToLocalStorage(id, value)
{
  /**
   * addToLocalStorage - Adds the added grocery item to local storage
   * First we retrieve whatever is stored in the local storage store it in and array
   * Then we create a new grocery item object
   * Append the object to the grocery list retrieved from local storage
   * resend the item to the local storage
   */
  const groceryItem = {id, value};
  const items = getLocalStorage();

  items.push(groceryItem);

  //  Push To Local Storage
  localStorage.setItem("list", JSON.stringify(items));

}

function editLocalStorage(id, value)
{
  /**
   * editLocalStorage - Modify A Stored Value In the Local Storage
   * Retrieve the list from local storage, modify the list, and resend it
   */
   let items = getLocalStorage();

   items.forEach((item) => {
    if (item.id == id)
    {
      item.value = value;
    }
   });

   localStorage.setItem("list", JSON.stringify(items))
}

function removeFromLocalStorage(id)
{
  	/**
     * removeFromLocalStorage - removes a specified item from the list in local storage
    */
     let items = getLocalStorage();

     items = items.filter((item) => {
      if (item.id !== id)
      {
        return item;
      }
     });

localStorage.setItem("list", JSON.stringify(items));
}


// ****** Set Up **********
function setUpItems()
{
  /**
   * setUpItems - check wether there are items in the local storage
   * if there are: we create grocery items and display them on the container
   */
  let items = getLocalStorage();
  if (items.length > 0)
  {
    items.forEach((item) => {
      createGroceryItem(item.id, item.value);
    });
  groceryContainer.classList.add("show-container");
  }
}
