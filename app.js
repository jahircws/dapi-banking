
const headers = {
    'lean-app-token': 'f25ab2f9-0b52-4365-9edc-03647614ceb8',
    'Content-Type': 'application/json',
}
const apiUrl = 'https://sandbox.leantech.me/'
const appToken = "f25ab2f9-0b52-4365-9edc-03647614ceb8"

$('#createCustomerForm').on('submit', (e)=>{
    e.preventDefault();
    let cust_app_id = $('#cust_no').val().trim();

    if(cust_app_id){
        let requestData = {
            "app_user_id": cust_app_id
        };
        
        $('#btnSubmit').attr('disabled', 'disabled')
        $('#btnSubmit').html('Loading...')
        fetch(`${apiUrl}customers/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'lean-app-token': appToken
            },
            body: JSON.stringify(requestData)
        }).then(response => {
            const statusCode = response.status;
            if (statusCode === 200) {
              return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
        })
        .then(data => {
            // Process the response data
            return data
            console.log("Data:",data);
        })
        .catch(error => {
            console.error(error);
            alert(error)
        });

        $('#btnSubmit').removeAttr('disabled')
        $('#btnSubmit').html('Create')
    }else{
        alert("Please enter customer unique id")
    }
});

function getCustomer(){
    fetch(`${apiUrl}customers/v1/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'lean-app-token': appToken
        },
    }).then(response => {
        const statusCode = response.status;
        if (statusCode === 200) {
          return response.json();
        } else {
            console.log(response)
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .then(data => {
        // Process the response data
        return data
        console.log("Data:",data);
    })
    .catch(error => {
        console.error(error);
        alert(error)
    });
}

function linkLean(){
    Lean.connect({
        app_token: 'f25ab2f9-0b52-4365-9edc-03647614ceb8',
        permissions: ["identity","accounts","transactions","balance"],
        customer_id: 'a44002e2-2ae0-4bce-8ecf-64b2f99643f3',
        sandbox: true,
    })
}

function getEntity() {

    fetch(`${apiUrl}customers/v1/a44002e2-2ae0-4bce-8ecf-64b2f99643f3/entities/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'lean-app-token': appToken
        },
    }).then(response => {
        const statusCode = response.status;
        if (statusCode === 200) {
          return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .then(data => {
        // Process the response data
        // console.log("Data:",data[0].id); //entity_id
        if(data[0].id){
            getIndentity(data[0].id)
        }
    })
    .catch(error => {
        console.error(error);
        alert(error)
    });
}

function getIndentity(entity_id){
    fetch(`${apiUrl}data/v1/accounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'lean-app-token': appToken
        },
        body: JSON.stringify({'entity_id': entity_id})
    }).then(response => {
        const statusCode = response.status;
        if (statusCode === 200) {
          return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .then(data => {
        // Process the response data
        // console.log("Data:",data);
        tblHtml = '';
        if(data.payload.accounts){
            data.payload.accounts.map((val, i) => {
                console.log(val)
                tblHtml += '<tr>\
                    <td>'+(i+1)+'</td>\
                    <td>Type: '+val.type+'<br/>'+val.account_number+'</td>\
                    <td>IBAN: '+val.iban+'</td>\
                    <td id="bal-'+(i+1)+'"></td>\
                    <td><button type="button" class="btn btn-sm btn-primary" onclick="getBalance('+i+', `'+val.account_id+'`, `'+entity_id+'`)">Balc.</button><button type="button" class="btn btn-sm btn-info" onclick="getTransactions(`'+val.account_id+'`, `'+entity_id+'`)">Trans.</button></td>\
                </tr>'
            })
        }else{
            tblHtml = '<tr><td colspan="5"><h6 class="text-center">No record found</h6>/td></tr>';
        }
        $('#accountList').html(tblHtml)
    })
    .catch(error => {
        console.error(error);
        alert(error)
    });
}

function getBalance(id, account_id, entity_id){
    fetch(`${apiUrl}data/v1/balance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'lean-app-token': appToken
        },
        body: JSON.stringify({'entity_id': entity_id, 'account_id': account_id})
    }).then(response => {
        const statusCode = response.status;
        if (statusCode === 200) {
          return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .then(data => {
        // Process the response data
        // console.log("Balc Data:",data);
        if(data.status === 'OK'){
            $('#bal-'+(id+1)).html(data.payload.currency_code+" "+data.payload.balance)
        }
    })
    .catch(error => {
        console.error(error);
        alert(error)
    });
}

function getTransactions(account_id, entity_id){
    fetch(`${apiUrl}data/v1/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'lean-app-token': appToken
        },
        body: JSON.stringify({
            'entity_id': entity_id, 
            'account_id': account_id,
            "start_date": "2023-05-01",
            "end_date": "2023-01-01",
            "insights": true
        })
    }).then(response => {
        const statusCode = response.status;
        if (statusCode === 200) {
          return response.json();
        } else {
            console.log("trans error:", response)
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .then(data => {
        // Process the response data
        console.log("Transaction Data:",data);
    })
    .catch(error => {
        console.error(error);
        alert(error)
    });
}