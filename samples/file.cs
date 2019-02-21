using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour {

  public void Update() {
    if(Input.GetButtonDown("Fire1")) {
      Debug.Log(Input.mousePosition);
    }
  }
}
