const db = require("../database") // Importer la connexion à la base de données depuis le fichier "database"

// Fonction pour obtenir tous les utilisateurs
exports.getAllUsers = function (req, res) {
	db.all("SELECT * FROM users", [], (err, rows) => { // Exécuter une requête pour sélectionner tous les enregistrements de la table "users"
		if (err) { // Si une erreur survient lors de l'exécution de la requête
			res.status(500).json({ error: err.message }) // Retourner un statut 500 avec le message d'erreur en JSON
		} else { // Si aucun problème n'est survenu
			res.json(rows) // Retourner les lignes récupérées en réponse JSON
		}
	})
}

// Fonction pour créer un nouvel utilisateur
exports.createNewUser = (req, res) => {
	// Récupérer les données envoyées dans le corps de la requête (firstName et lastName)
	const { firstName, lastName } = req.body

    // Fonction pour vérifier si une chaîne est alphanumérique
	function isAlphanumeric(str) {
		const regex = /^[a-zA-Z0-9]+$/ // Expression régulière pour autoriser uniquement les lettres et chiffres
		return regex.test(str) // Retourner true si la chaîne correspond au format alphanumérique
	}

    if (!firstName || !lastName) // Vérifier que les champs firstName et lastName ne sont pas vides
        return res.status(400).json({ error: "The first name and last name are required !" }) // Si l'un des deux est vide, retourner une erreur 400

    if (typeof firstName !== "string") // Vérifier que firstName est bien une chaîne de caractères
        return res.status(400).json({ error: "That's a weird name !" }) // Si ce n'est pas une chaîne, retourner une erreur 400

    if (!isAlphanumeric(firstName)) // Vérifier que firstName est alphanumérique
		return res.status(400).json({ error: "Ce nom n'est pas autorisé !" }) // Si ce n'est pas alphanumérique, retourner une erreur 400

    // Insérer un nouvel utilisateur dans la base de données avec les valeurs de firstName et lastName
	db.run(
		"INSERT INTO users (firstName, lastName) VALUES (?, ?)", // Requête SQL pour insérer un nouvel utilisateur
		[firstName, lastName], // Paramètres pour la requête SQL
		function (err) { // Fonction callback exécutée après l'insertion
			if (err) { // Si une erreur survient lors de l'insertion
				res.status(500).json({ error: err.message }) // Retourner une erreur 500 avec le message d'erreur
			} else { // Si l'insertion est réussie
				res.status(201).json({ id: this.lastID, firstName }) // Retourner un statut 201 avec l'ID du nouvel utilisateur et le prénom
			}
		}
	)
}

// Fonction pour modifier un utilisateur existant
exports.modifieNewUser = (req, res) => {
	// Récupérer les données envoyées dans le corps de la requête (firstName et lastName)
    const { firstName, lastName } = req.body
    const userId = parseInt(req.params.id) // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    let updateFields = [] // Tableau pour stocker les champs à mettre à jour
	let queryParams = [] // Tableau pour stocker les valeurs des champs à mettre à jour

	if (firstName) { // Si firstName est fourni
		updateFields.push("firstName = ?") // Ajouter firstName au tableau des champs à mettre à jour
		queryParams.push(firstName) // Ajouter la valeur de firstName aux paramètres de la requête
	}

	if (lastName) { // Si lastName est fourni
		updateFields.push("lastName = ?") // Ajouter lastName au tableau des champs à mettre à jour
		queryParams.push(lastName) // Ajouter la valeur de lastName aux paramètres de la requête
	}

	if (updateFields.length > 0) { // Si au moins un champ est à mettre à jour
		queryParams.push(userId) // Ajouter userId à la fin des paramètres de la requête

		const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?` // Construire la requête SQL pour mettre à jour l'utilisateur

		db.run(query, queryParams, function (err) { // Exécuter la requête avec les paramètres fournis
			if (err) { // Si une erreur survient lors de l'exécution
				res.status(500).json({ error: err.message }) // Retourner une erreur 500 avec le message d'erreur
			} else if (this.changes === 0) { // Si aucune ligne n'a été modifiée (utilisateur non trouvé)
				res.status(404).json({ message: "Utilisateur non trouvé" }) // Retourner une erreur 404
			} else { // Si la mise à jour a réussi
				res.json({ msg: "Utilisateur mis à jour", userId, firstName, lastName }) // Retourner un message de succès et les données de l'utilisateur mis à jour
			}
		})
	} else { // Si aucun champ à mettre à jour n'a été fourni
		res.status(400).json({ message: "Aucun champ à mettre à jour" }) // Retourner une erreur 400
	}
}

// Fonction pour supprimer un utilisateur
exports.deleteNewUser = exports.deleteUser = (req, res) => {
	const { id } = req.params // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

	db.run("DELETE FROM users WHERE id = ?", [id], function (err) { // Exécuter la requête SQL pour supprimer l'utilisateur avec l'ID spécifié
		if (err) { // Si une erreur survient lors de l'exécution de la requête
			res.status(500).json({ error: err.message }) // Retourner une erreur 500 avec le message d'erreur
		} else if (this.changes === 0) { // Si aucune ligne n'a été modifiée (utilisateur non trouvé)
			res.status(404).json({ message: "User not found" }) // Retourner une erreur 404
		} else { // Si la suppression a réussi
			res.status(200).json({ message: "User deleted !" }) // Retourner un message de succès
		}
	})
}
