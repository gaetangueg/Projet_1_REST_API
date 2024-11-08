const express = require('express');
const app = express();
const port = 3000;
const usersRouter = require("./user.js")

// MIDDLEWARE
app.use(express. json())
// users endpoint
app. use("/api/", usersRouter)

app.listen(port, () => {
	console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

// GET : LIRE tous les utilisateurs
app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id)

	// trouve son index, verifier si le userIndex est positive
	const userIndex = users.findIndex((user) => user.id === id)

	// utilisateur non trouvé
	if (userIndex < 0)
		return res.status(404).json({ msg: "utilisateur non trouvé" })
	// si el est trouvé

	res.json(users[userIndex])
})