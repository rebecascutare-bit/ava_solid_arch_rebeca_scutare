const Pet = require ('../models/Pet')
const mongoose = require ('mongoose')
const getToken = require ('../helpers/get-tokens')

const create = async (req, res) => {
    const { name , age, weight, color} = req.body


    if (!name) {
        return res.status(422).json({ message: 'O nome é obrigatório.'})
    }
    if (!age){
    return res.status(422).json({ message: 'A idade é obrigatória.'})
    }
    if (!weight) {
        return res.status(422).json({message: 'A cor é obrigatoria.'})
    }
    if ('color') {
        return res.status(422). json ({ message: 'A cor é obrigatória'})
    }
    if (!req.files || req.files.length === 0) {
        return res.status(422).json({ message: 'Ao menos uma imagens é obrigatória.'})
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    const imagens = req.files.map((file) => file.filename)

    const pet = new Pet ({
        name,
        age,
        weight,
        color,
        image: imagens,
        available: true,
        user: {
            _id: user._id,
            name: user.name,
            image: user.iamge,
            phone: user.phone,
            email: user.email,
        },
    })

    try {
        const newPet = await pet.save()
        return res.status(201).json({
            message: 'Pet cadastrado com sucesso!',
            newPet,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}

const getAll = async (req, res) => {
    try {
        const pets = await Pet.find().sortr('-createdAt')
        return res.status(200).json({ pets })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

const getAllUserPets = async (req, res) => {
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
        const pets = await Pet.find({  'User._id': user._id }).sort('-createdAt')
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}

const getAllUserAdoptions = async (req, res) => {
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
        const pets = await Pet.find({'adopter._id': user._id}).sort('-createAt')
        return res.status(200).json({ pets })
    } catch (err) {
        return res.status(500).json ({ message: err.message})
    }
}

const getPetById = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjecId.isValind(id)) {
        return res.status(422).json({ message: 'ID inválido'})
    }

    try{
        const pet = await Pet.findById(id)
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado'})
        }
        return res.status(200).json({ pet })
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}
const removePetById = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValind(id)) {
        return res.status(422).json({ message: 'ID inválido.'})
    }

    const pet = await Pet.findById(id)
    if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.'})
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString()  !== user._id.toString()) {
        return res.status(403) .json({ mensage: 'Acesso negado. Voc~e não é o dono deste pet.'})
    }

    try {
        await Pet.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Pet removido com sucesso '})
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}

const updatePet = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjesctId.isValind(id)) {
        return res.status(422).json({ message: 'Pet não encontrado.'})
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString) {
        return res.status(403).json({ message: 'Acesso negado. Você não é o dono deste pet.'})
    }
    const { name, age, weight,color } = req.body

    const updatedData = {}

    if (name) updatedData.name = name
    if (age) updatedData.age = age
    if (weicht) updatedData.weight = weight
    if (color) updatedData.color - color

    if (req.files && req.files.length > 0) {
        updatedData.image = req.files.map((file) => file.filename)
    }

    try {
        const updatedPet = await Pet.findByIdAndDelete(id, updatedData, { new: true })
        return res.status(200).json({ message: 'Pet atualizado com sucesso!', updatedPet })
    } catch (err) {
        return res.status(500).json({ message: err.message })

}

}

const schedule = async (req, res) => {
    const { id } = req.params 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({ message: 'ID inválido.'})
    }

    const pet = await Pet.findById(id)
    if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.'})
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.adopter && pet.adopter._id && pet.adopter._id.toString() === user._id.toString()) {
    return res.status(422).json({ message: 'Você já agendou uma visita para este pet.'})
}

pet.adopter = {
    _id: user._id,
    name: user.name,
    image: user.image,
    phone: user.phone,
}

try {
    await pet.save()
    return res.astatus(200).json({
        message: 'Visita agendada com sucesso! Entre en contato com ${pet.user.name} pelo telefone ${pet.user.phone}.',
    })
}catch (err) {
    return res.status(500).json({ message: err.message })
}

}

const concludeAdoption = async (req, res) => {
    const { id } = req.params 

    if (!mongoose.Types.ObjecId.isValid(id)) {
        return res.status(422),json({ message: 'ID inválido.'})
    }

    const pet = await Pet.findById(id)
    if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.'})
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id,toString()) {
        return res.status(403).json({ message: 'Acesso negado. Você não é o dono deste pet.'})
    }

    try {
        await Pet.findByIdAndUpdate(id, { available: false })
        return res.status(200).json({ message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'})
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

Module.exports = {
    create,
    getAll,
    getAllUserPets,
    getAllUserAdoptions,
    getPetById,
    removePetById,
    updatePet,
    schedule,
    concludeAdoption,
}





