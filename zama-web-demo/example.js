const assert = require("node:assert").strict;
const {
  Shortint,
  ShortintParametersName,
  ShortintParameters,
} = require("tfhe");

function shortint_example() {
  let params_name =
    ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M128;
  let params = new ShortintParameters(params_name);
  console.log("Generating client keys...");
  let cks = Shortint.new_client_key(params);
  console.log("Encrypting 3...");
  let ct = Shortint.encrypt(cks, BigInt(3));

  let serialized_cks = Shortint.serialize_client_key(cks);
  let deserialized_cks = Shortint.deserialize_client_key(serialized_cks);

  let serialized_ct = Shortint.serialize_ciphertext(ct);
  let deserialized_ct = Shortint.deserialize_ciphertext(serialized_ct);

  console.log("Decrypting ciphertext...");
  let decrypted = Shortint.decrypt(deserialized_cks, deserialized_ct);
  assert.deepStrictEqual(decrypted, BigInt(3));
  console.log("Decryption successful!");

  console.log("Generating compressed ServerKey...");
  let sks = Shortint.new_compressed_server_key(cks);

  let serialized_sks = Shortint.serialize_compressed_server_key(sks);
  let deserialized_sks =
    Shortint.deserialize_compressed_server_key(serialized_sks);
  console.log("All done!");
}

shortint_example();
