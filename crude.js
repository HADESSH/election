const { Client, TableID } = Appwrite;
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("64a0e3f1b7c5d9e6f8a2"); // Your project ID

const promuise = tablesDB.createRow({
  databaseID: databaseID,
  tableID: tableID,
  rowID: ID.unique(),
  data: {
    name: input[0].value,
    price: parseFloat(input[1].value),
    cost_price: parseFloat(input[2].value),
    stock: parseInt(input[3].value),
    image: input[4].value,
    description: input[5].value,
  },
});

//delete
// const { Client, TablesDB } = Appwrite;
//  const client = new Client()
//     .setEndpoint('https://<REGION>.cloud.appwrite.io/v1')
//     .setProject('<PROJECT_ID>');
//  const tablesDB = new TablesDB(client);
//  let promise = tablesDB.deleteRow({
//     databaseId:'<DATABASE_ID>',
//     tableId:'<TABLE_ID>',
//     rowId:'<ROW_ID>'
// });
//  promise.then(function (response) {
//     console.log(response);
// }, function (error) {
//     console.log(error);
// });

function DeleteRow(id) {
  let a = confirm("Are you sure you want to delete this row>");
  if(confirm ("Are you sure you want to delet this row>")){
    let promise = tablesDB.deleteRow({
      databaseId: "<DATABASE_ID>",
      tableId: "<TABLE_ID>",
      rowId: "<ROW_ID>",
    });
    promise.then(
      function (response) {
        console.log(response);
        GetData();
      },
      function (error) {
        console.log(error);
      },
    );
  }
}
