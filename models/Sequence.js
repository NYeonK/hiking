const mongoose = require("mongoose");

const CounterSchemna = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const Counter = mongoose.model('Counter', CounterSchemna);

const getSequenceNextValue = (seqName) => {
    return new Promise((resolve, reject) => {
        Counter.findByIdAndUpdate(
            { "_id" : seqName },
            { "$inc": { "seq": 1 } }
            , (err, counter) => {
                if(err) {
                    reject(err);
                }
                if(counter) {
                    resolve(counter.seq + 1);
                } else {
                    resolve(null);
                }
            });
    });
};

const insertCounter = (seqName) => {
    const newCounter = new Counter({ _id: seqName, seq: 1 });
    return new Promise((resolve, reject) => {
        newCounter.save()
        .then(data => {
            resolve(data.seq);
        })
        .catch(err => reject(err));
    });
}

module.exports = {
    Counter,
    getSequenceNextValue,
    insertCounter
}