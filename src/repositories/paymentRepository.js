import Payment from '../schema/payment.js';
import crudRepository from './crudRepository.js';

const paymentRepository = {
    ...crudRepository(Payment),
    updateOrder: async function(orderId, data){
        const updataDoc = await Payment.findOneAndUpdate({
            orderId
        }, data, {
            new: true
        });
        return updataDoc;
    }
}

export default paymentRepository;