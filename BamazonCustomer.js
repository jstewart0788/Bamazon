//Decalare all required npm modules
var inquirer = require('inquirer');
var mysql = require('mysql');
//connect to mysql server
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});
//application will allow user to buy items until closed
while(true)
{   //holds list of IDs in database
    var id = [];
    //entire program occurs in query which returns all items
     connection.query('SELECT * from Products',function(err, res) {
    	if (err) throw err;    //if error throw it
        //print all items for customer to purchase
    	for(var i = 0; i<res.length; i ++)
    	{
    		console.log("---------------------");
    	    console.log(res[i].ItemID + ") " + res[i].ProductName + " - " + res[i].DepartmentName);
    	    console.log("Price: $" + res[i].Price);
    	    console.log("---------------------");
    	    id.push(res[i].ItemID);//push every id into an array for use later
    	}
        //ask the customer which item they would like to purchase
        inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: "Input the ID of number you'd like to buy. . . "
        },
        {
            type: 'input',
            name: 'quantity',
            message: "How many would you'd like to buy. . . "
        }

    	]).then(function (answers) {
    		var pos = id.indexOf(parseInt(answers.id)); // find the position of the item in the res array
    		if((res[pos].StockQuantity - answers.quantity)>=0) //test to see if enough quantity in stock
    		{
                //print results to user
    			console.log('You have succesfully purchased ' + answers.quantity + ' x ' + res[pos].ProductName  );
                //update database
    			connection.query("UPDATE Products SET StockQuantity = ? WHERE ItemID = ?", [(res[pos].StockQuantity - answers.quantity), answers.id]);
                //Shows total amount of purchase
                console.log('Your total cost is $' + (parseInt(answers.quantity) * res[pos].Price));     
    		}
    		else
    		{
    			console.log("Item not in stock."); // else tell user we are out of stock
    		}
        });
     });
}