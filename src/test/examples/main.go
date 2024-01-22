package main
 
/* Main function documentation 
   using line by line block 
   lets go */
func main() {
	err := os.Chdir("/")
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Hello world!!!")
}

// Main function documentation
// using line by line block
// lets go
func main() {
	err := os.Chdir("/")
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Hello world!!!")
}
