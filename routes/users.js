const express = require("express")
const router = express.Router()
const { getAllUsers ,
		createNewUser,
		modifieNewUser,
		deleteNewUser,
} = require("../controllers/usersControllers")

/*const usersArray = [
    { id: 1, firstName: "John", lastName: "Doe", role: "admin" },
    { id: 2, firstName: "Jane", lastName: "Smith", role: "user" },
    { id: 3, firstName: "Alice", lastName: "Johnson", role: "moderator" },
    { id: 4, firstName: "Bob", lastName: "Brown", role: "user" },
    { id: 5, firstName: "Charlie", lastName: "Davis", role: "admin" },
];*/

const db = require("../database")

// Endpoint pour obtenir tous les utilisateurs
router.get("/users", getAllUsers);


router.get("/users", (req, res) => {
    res.json({
        msg: "Ceci est un test depuis le routeur",
    })
})

// créer un nouvel utilisateur
// POST : CRÉER un nouvel utilisateur, basé sur les données passées dans le corps(body) de la requête
router.post("/users", createNewUser)

router.put ("/users/:id", modifieNewUser)

router.delete("/users/:id", deleteNewUser)

module.exports = router