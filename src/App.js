import React, { useReducer, useState } from "react";
import axios from "axios"
import "./App.css";

const api = axios.create({
  baseURL: "https://api.mercadopago.com"
});


api.interceptors.request.use(async config => {
 

  const token = "APP_USR-1336869924281337-101713-3691afe53636cb340cbcfd133a78541b-462014152"
  config.headers.Authorization = `Bearer ${token}`

  return config
});
 
const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function App() {

  const [formData, setFormdata] = useReducer(formReducer, {})
  const [responsePayment, setResponsePayment] = useState(false) //Verificando o status 
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(false)
  const [statusPayment, setStatusPayment] = useState(false)


  const handleChange = event => {
    setFormdata({
      name: event.target.name,
      value: event.target.value
    })
  }

  //Verifica o Status
  const getStatusPayment = () => {
    api
      .get(`v1/payments/${responsePayment.data.id}`)
      .then(response => {
        if (response.data.status === "approved") {
        }
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    

    const body = {
      
      "transaction_amount": parseFloat( formData.transaction_amount),
      "description": document.getElementById("Description").value,  
      "payment_method_id": "pix",
      "payer": {
        "email": document.getElementById("Email").value,  
        "first_name": document.getElementById("Nome").value,
        "last_name": "Teste",
        "identification": {
          "type": "CPF",
          "number": "01234567890"  
        }
      },
      "notification_url": "https://followmme.com.br/api/Notification"

    
      
    }
    console.log(body);
//Checagem de status
    api.post("v1/payments", body).then(response => {
      setResponsePayment(response)
      setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url)
    }).catch(err => {
      
    })
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          PIX com API do Mercado pago
        </p>

        {
          !responsePayment && <form onSubmit={handleSubmit}>

            <div>
              <label>E-mail</label>
              <input onChange={handleChange} name="email"  id="Email" />
            </div>

            <div>
                <label>Valor</label>
                <input onChange={handleChange} name="transaction_amount" value={formData.transaction_amount} required placeholder="Valor da compra" />
              
              
              </div>

              <div>
              <label>Descricaol</label>
              <input onChange={handleChange} name="email"  id="Description" />
            </div>
          
               
            <div>
              <label>Nome</label>
              <input onChange={handleChange} name="nome" id="Nome" />
            </div>
            <div>
              <label>Sobre Nome</label>
              <input onChange={handleChange} name="nome" id="SurName" />
            </div>

            <div>
              <label>CPF</label>
              <input onChange={handleChange} name="cpf"   id="CPF"/>
            </div>

            <div>
              <button type="submit">Pagar</button>
            </div>
          </form>
        }

        {responsePayment &&
          <button onClick={getStatusPayment}>Verificar status pagamento</button>
        }

        {
          linkBuyMercadoPago && !statusPayment &&
          < iframe src={linkBuyMercadoPago} width="400px" height="620px" title="link_buy" />
        }

        {
          statusPayment &&
          <h1>
            Compra Aprovada
          </h1>
        }


      </header>
    </div >
  );
}

export default App;
