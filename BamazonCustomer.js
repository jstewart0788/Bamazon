var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

var id = [];

 connection.query('SELECT * from Products',function(err, res) {
	if (err) throw err;
	for(var i = 0; i<res.length; i ++)
	{
		console.log("---------------------");
	    console.log(res[i].ItemID + ") " + res[i].ProductName + " - " + res[i].DepartmentName);
	    console.log("Price: $" + res[i].Price);
	    console.log("---------------------");
	    id.push(res[i].ItemID);
	}

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
		var pos = id.indexOf(parseInt(answers.id));
		if((res[pos].StockQuantity - answers.quantity)>=0)
		{
			console.log('You have succesfully purchased ' + answers.quantity + ' x ' + res[pos].ProductName  );
            //Shows total amount of purchase
            console.log('Your total cost is $' + (parseInt(answers.howMany) * res[pos].Price));     
		}
		else
		{
			console.log("Item not in stock.");
		}
    });
 });
