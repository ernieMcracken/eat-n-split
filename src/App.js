import { useDebugValue, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    toggleAddFriend();
  }

  function toggleAddFriend() {
    console.log("toggle");
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleSelectFriend(friend) {
    console.log(friend);

    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((el) =>
        el.id === selectedFriend.id
          ? { ...el, balance: el.balance + value }
          : el
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            onAddFried={handleAddFriend}
            onShowAddFriend={toggleAddFriend}
          />
        )}
        <Button onClick={toggleAddFriend}>
          {!showAddFriend ? "Add Friend" : "Close"}
        </Button>
      </div>
      <div>
        {selectedFriend && (
          <FormSplitBill
            friend={selectedFriend}
            onSplitBill={handleSplitBill}
          ></FormSplitBill>
        )}
      </div>
    </div>
  );
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  console.log(friend.id, selectedFriend);

  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFried }) {
  const defaultURL = "https://i.pravatar.cc/48?u=";
  const [name, setName] = useState("");
  const [image, setImage] = useState(defaultURL);

  function handleSubmit(ev) {
    ev.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      balance: 0,
      image: `${image}?=${id}`,
      id,
    };

    onAddFried(newFriend);

    setName(() => "");
    setImage(() => defaultURL);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="name">👨‍👩‍👧 Friend's name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <label htmlFor="image">🌉 Image URL</label>
      <input
        type="text"
        name="image"
        id="image"
        value={image}
        onChange={(ev) => setImage(ev.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [total, setTotal] = useState("");
  const [spend, setSpend] = useState("");
  const [whoPays, setWhoPays] = useState("user");

  const friendSpend = total ? total - spend : "";

  function handleSubmit(ev) {
    ev.preventDefault();
    console.log("submit");

    if (!total || !friendSpend) return;

    onSplitBill(whoPays === "user" ? friendSpend : -spend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label htmlFor="bill">💰 Bill Amount</label>
      <input
        type="number"
        id="bill"
        value={total}
        onChange={(ev) => setTotal(Number(ev.target.value))}
      />

      <label htmlFor="spend">🙋‍♀️ Your spend</label>
      <input
        type="number"
        id="spend"
        min="0"
        max={total}
        value={spend}
        onChange={(ev) =>
          setSpend(
            Number(ev.target.value) > total ? spend : Number(ev.target.value)
          )
        }
      />

      <label htmlFor="bill">👩‍👦 {friend.name}'s spend</label>
      <input type="text" id="bill" disabled value={friendSpend} />

      <label htmlFor="who">👌 Who is paying the bill?</label>
      <select
        name="who"
        id="who"
        value={whoPays}
        onChange={(ev) => setWhoPays(ev.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
