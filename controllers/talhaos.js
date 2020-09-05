const Talhao = require('../models/Talhao');

//Get List
exports.getTalhaos = async (req, res, next) => {
  try {
    const talhaos = await Talhao.find();
    return res.status(200).json({
      success: true,
      count: talhaos.length,
      data: talhaos 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Erro no servidor.'});
  }
};

//Create
exports.addTalhao = async (req, res, next) => {
  try {
    const talhao =  await Talhao.create(req.body);
    
    return res.status(200).json({
      success: true,
      data: talhao
    });
  } catch (err) {
    if(err.code === 11000) {
      return res.status(400).json({error: 'Ja existe um registro com esse id' });
    } 
    console.error(err);
    res.status(500).json({error: 'Erro no servidor.'});
  }
};