const express = require("express")
const router = express.Router()

/*const usersArray = [
    { id: 1, firstName: "John", lastName: "Doe", role: "admin" },
    { id: 2, firstName: "Jane", lastName: "Smith", role: "user" },
    { id: 3, firstName: "Alice", lastName: "Johnson", role: "moderator" },
    { id: 4, firstName: "Bob", lastName: "Brown", role: "user" },
    { id: 5, firstName: "Charlie", lastName: "Davis", role: "admin" },
];*/

const db = require("../database")

// Endpoint pour obtenir tous les utilisateurs
router.get("/users", (req, res) => {
	db.all('SELECT * FROM users', [], (err, rows) => {
		if (err) {
		  res.status(500).json({ error: err.message });
		} else {
		  res.json(rows);
		}
	  });
	
});


router.get("/users", (req, res) => {
    res.json({
        msg: "Ceci est un test depuis le routeur",
    })
})

// créer un nouvel utilisateur
// POST : CRÉER un nouvel utilisateur, basé sur les données passées dans le corps(body) de la requête
router.post("/", (req, res) => {
	// récupérer toutes les données qui arrivent dans le corps de la requête (body)
	const { firstName, lastName } = req.body

	// récupérer l'ID du dernier utilisateur en fonction du nombre d'utilisateurs dans notre variable de tableau 'users'.
	const lastId = users[users.length - 1].id
	// ajouter un pour créer un utilisateur unique
	const newId = lastId + 1

	// créer le nouvel utilisateur avec les données du corps de la requête et l'ID calculé
	const newUser = {
		firstName,
		lastName,
		id: newId,
	}

	// ajouter le nouvel utilisateur à notre liste d'utilisateurs en utilisant la méthode 'push'
	users.push(newUser)
	// envoyer le code de statut 201 (créé) et les données du nouvel utilisateur afin de confirmer au client.
	res.status(201).json(newUser)
})

router.put ("/:id", (req, res) => {
    // récupérer toutes les données qui arrivent dans le corps de la requête (body)
	
    const { firstName, lastName } = req.body
    const id = parseInt(req.params.id)

    // trouve son index, verifier si le userIndex est positive
	const userIndex = users.findIndex((user) => user.id === id)

    	// utilisateur non trouvé
	if (userIndex < 0)
		return res.status(404).json({ msg: "utilisateur non trouvé" })

    // si el est trouvé, nous vérifions quelles valeurs ont été envoyées
	

	if (firstName) users[userIndex].firstName = firstName
	if (lastName) users[userIndex].lastName = lastName

    res.json({
		msg: "utilisateur mis à jour",
		user: users[userIndex],
	})
    

})

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id)

    	// trouve son index, verifier si le userIndex est positive
	const userIndex = users.findIndex((user) => user.id === id)

	// utilisateur non trouvé
	if (userIndex < 0)
		return res.status(404).json({ msg: "utilisateur non trouvé" })

    // si el est trouvé
	users.splice(userIndex, 1)

	res.json({
		msg: "utilisateur suprimée",
	})
   // res.json({
     //   msg: "hello rest API ici le delete !!!",
    //})
})

module.exports = router