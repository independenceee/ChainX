use cardano/transaction.{Transaction, OutputReference}

validator marketplace {
    
    spend(_datum: Option<Void>, _redeemer: Void, _output_reference: OutputReference, _transaction: Transaction) {
        True
    } 
}