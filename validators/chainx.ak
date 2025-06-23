use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction, OutputReference}
use cardano/tx
use aiken/crypto.{VerificationKeyHash}

validator chainx(platform_payment_credential: VerificationKeyHash) {
  mint(_redeemer: Data, _policy_id: PolicyId, transaction: Transaction) {
    let Transaction {  extra_signatories, .. } =
      transaction
    tx.verify_signature(extra_signatories, platform_payment_credential)
  }
}



