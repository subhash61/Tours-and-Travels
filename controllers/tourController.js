const Tour = require('../model/tourModel');

exports.topCheapTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,duration,summary';
  next();
};

exports.getAlltours = async (req, res) => {
  try {
    // console.log('req.query:', req.query);

    const queryObj = { ...req.query };
    const excludedObj = ['sort', 'limit', 'page', 'fields'];
    excludedObj.forEach((el) => delete queryObj[el]);

    // console.log(req.requestTime);

    // const tours = await Tour.find({
    //   ratingsAverage: 4.5,
    //   difficulty: 'easy',
    // });
    //db.tours.find({raitngsAverage: {$lte: 4.5}, duration: {$lte: 20}})

    //ADVANCED QUERY
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // QUERY
    let query = Tour.find(JSON.parse(queryStr));

    //SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-ratingsAverage');
    }

    //LIMITING FIELDS
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //PAGINATION
    //1-10, 11-20, 21-30
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 1;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("this page doen't exist");
    }

    // .where('ratingsAverage')
    // .equals(4.5)
    // .where('difficulty')
    // .equals('easy');

    //EXECUTING QUERY
    const tours = await query;

    //SENDING RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
      message: err.msg,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour()
    // newTour.save().then()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
      message: err.message,
    });
  }
};

//  const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// 3. ROUTE HANDLERS OR CONTROLLERS
// exports.checkId = (req, res, next, val) => {
//   // console.log(`this is the tour ${val}`);
//   if (val > tours.length) {
//     // if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'ERROR',
//       message: 'missing name or price ',
//     });
//   }
//   next();
// };
