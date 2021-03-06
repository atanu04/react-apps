import React, { useState, useEffect } from "react";
import Alert from "./Components/Alert";
import List from "./Components/List";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditng] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //display alert
      // const newAlert = { show: true, msg: "Enter value", type: "danger" };
      //setAlert(newAlert);
      showAlert(true, "Enter value", "danger");
    } else if (name && isEditing) {
      //edit
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setIsEditng(false);
      setEditId(null);
      showAlert(true, "item updated", "success");
    } else {
      //alert
      showAlert(true, "item added successfully", "success");
      //add item
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }

    console.log("submit");
  };
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };
  const clearList = () => {
    showAlert(true, "All item deleted", "danger");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "item removed", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const requireditem = list.find((item) => item.id === id);
    setName(requireditem.title);
    setEditId(id);
    setIsEditng(true);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} remove={showAlert} list={list} />}
        <h3>Grocery</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eggs"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear item
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
