/*Insertion*/
db.lego.insertMany([
    {
        'nom': 'Lego Creator 3-in-1',
        'annee_sortie': 2000,
        'nombre_de_pieces': 564,
        'prix': 59.99,
        'evaluations': [
            { 'utilisateur': 'Charlie', 'note': 4 }
        ]
    },
    {
        'nom': 'Faulcon Millenium',
        'annee_sortie': 2019,
        'nombre_de_pieces': 1050,
        'prix': 89.99,
        'theme': "Star Wars",
        'evaluations': [
            { 'utilisateur': 'David', 'note': 4 },
            { 'utilisateur': 'Eve', 'note': 3 }
        ]
    }
])

/****Modification*****/
/*Mettez à jour le prix du set "Lego Creator 3-in-1" à 49.99 €.*/
db.lego.updateOne(
    { '_id': ObjectId('67e40aff5fdacf7f5d11a28f') },
    { $set: { 'prix': 49.99 } })


/*Ajoutez une évaluation de l'utilisateur "Frank" avec une note de 4 pour le set "Millennium Falcon".*/

db.lego.updateMany(
    { 'nom': 'Faulcon Millenium' },
    {
        $push: {
            'evaluations': {
                'utilisateur': 'Frank',
                'note': 4
            }
        }
    })


/*****recherche******/
/*Listez tous les sets Lego ayant pour thème "Star Wars", triés par année de sortie en ordre décroissant.*/
db.lego.find(
    { 'theme': 'Star Wars' })
    .sort({ 'annee_sortie': -1 })

/*Listez les sets Lego qui ont un prix supérieur à 100€, triés par nombre de pièces décroissant.*/
db.lego.find(
    { 'prix': { $gt: 100 } })
    .sort({ 'nombre_de_pieces': -1 })

/*Lister les 3 sets Lego qui ont le plus de figurines, afficher uniquement leur nom et le nombre de figurines.*/
db.lego.find({},
    { '_id': 0, 'nom': 1, 'nombre_de_figures': 1 })
    .sort({ 'nombre_de_figures': -1 })
    .limit(3)

/*Trouvez les sets Lego avec une ou plusieurs évaluations supérieures ou égales à 4.*/
db.lego.find(
    { 'evaluations.note': { $gte: 4 } })

/*Trouvez les sets Lego ayant le thème "Technic" ou "Creator" et dont le nombre de pièces est inférieur à 2000.*/

db.lego.find({
    '$or': [
        { 'theme': 'Technic' },
        { 'theme': 'Creator' }
    ],
    'nombre_de_pieces': { $lt: 2000 }
})

/*Trouvez tous les sets Lego avec le thème "Harry Potter" publiés entre 2000 et 2010.
*/
db.lego.find(
    {
        'theme': 'Harry Potter',
        'annee_sortie': { $gte: 2000, $lte: 2010 }
    })

/*Trouvez les gros sets Lego les plus populaires, c’est-à-dire ceux dont la moyenne des évaluations est supérieure ou égale à 4 et dont le nombre de pièces est supérieur à 1000.
*/
db.lego.aggregate([
    {
        $addFields: {
            moyenne_notes: { $avg: '$evaluations.note' }
        }
    },
    {
        $match: {
            moyenne_notes: { $gte: 4 },
            nombre_de_pieces: { $exists: true, $ne: null, $lt: 1000 }
        }
    },
    {
        $group: {
            _id: '$nom',
            moyenne_notes: { $first: '$moyenne_notes' },
            nombre_de_pieces: { $first: '$nombre_de_pieces' }
        }
    }
])

/*Trouvez les sets Lego qui ont uniquement des évaluations de 5/5.*/
db.lego.aggregate(
    [
        {
            $addFields: {
                moyenne_notes: { $avg: '$evaluations.note' }
            }
        },
        {
            $match: {
                moyenne_notes: { $eq: 5 }
            }
        },
        {
            $group: {
                _id: '$nom',
                moyenne_notes: {
                    $first: '$moyenne_notes'
                }
            }
        }])

/**Supression ***/
/* Supprimez l'évaluation de l'utilisateur "Bob" pour le set "Faucon Millenium" de 2019.*/
db.lego.updateOne(
    { '_id': ObjectId('67e40b985fdacf7f5d11a292') },
    { $pull: { 'evaluations': { 'utilisateur': 'Bob' } } })

/* Supprimez tous les sets Lego dont le nombre de pièces est inférieur à 1000.*/

db.lego.deleteMany(
    { 'nombre_de_pieces': { $lt: 1000 } })
