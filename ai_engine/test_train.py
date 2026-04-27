import requests

# 100 Unique Healthcare Documents for Maternal and Child Support
health_knowledge = {
    "documents": [
        # --- FEVER & MALARIA (Cameroon Specific) ---
        "If a child's skin feels very hot (fever), give a sponge bath with lukewarm water. Do not use ice-cold water.",
        "A fever in Cameroon is often a sign of Malaria. Take the child for a Rapid Diagnostic Test (RDT) immediately.",
        "Ensure all children sleep under Long-Lasting Insecticidal Nets (LLINs) every single night to prevent malaria.",
        "Do not give a child aspirin for a fever; use paracetamol according to the weight-based dosage on the package.",
        "High fever accompanied by shivering and sweating is a classic sign of Malaria in children.",
        "If a fever lasts more than 24 hours despite home care, visit the nearest health center.",
        "Convulsions (shaking) during a high fever is an emergency. Keep the child on their side and rush to the hospital.",
        "Clear stagnant water around the house to prevent mosquitoes from breeding and spreading Malaria.",
        "Keep the child's room well-ventilated during a fever to help lower their body temperature.",
        "Monitor a child's temperature every 4 hours during a fever episode.",

        # --- DIARRHEA & DEHYDRATION ---
        "For diarrhea, give the child Oral Rehydration Salts (ORS). Mix one sachet in exactly one liter of clean, boiled water.",
        "If ORS is not available, a home-made solution of 6 level teaspoons of sugar and half a teaspoon of salt in 1 liter of water can be used.",
        "Continue breastfeeding frequently if a baby has diarrhea to prevent severe dehydration.",
        "Zinc supplements should be given for 10-14 days to children with diarrhea to reduce the severity of the episode.",
        "Signs of severe dehydration include sunken eyes, no tears when crying, and a very dry mouth.",
        "If a child with diarrhea is unable to drink or is lethargic (very sleepy), seek emergency medical care immediately.",
        "Always wash hands with soap and running water after changing a diaper or helping a child use the toilet.",
        "Avoid giving sugary drinks or soda to a child with diarrhea as it can make the condition worse.",
        "Diarrhea with blood in the stool (dysentery) requires immediate clinical consultation and antibiotics.",
        "Ensure drinking water is boiled or treated with chlorine to prevent cholera and other waterborne diseases.",

        # --- RESPIRATORY ISSUES & COUGH ---
        "Fast breathing or the chest sinking in when the child inhales (chest indrawing) are signs of Pneumonia.",
        "If a child has difficulty breathing or produces a whistling sound (wheezing), seek medical help immediately.",
        "For a simple cough, give the child plenty of warm fluids and breastmilk to soothe the throat.",
        "Keep children away from smoke (including wood-fire smoke and cigarettes) as it damages their lungs.",
        "A cough that lasts for more than 2 weeks could be a sign of Tuberculosis and needs clinical testing.",
        "If a child's lips or fingernails turn blue, it is a sign of lack of oxygen. This is a critical emergency.",
        "Use a saline (saltwater) drop to clear a baby's blocked nose before feeding.",
        "Pneumonia is a leading cause of death in children; early recognition of fast breathing saves lives.",
        "If a child is too weak to breastfeed or drink due to a cough, they need urgent hospital care.",
        "Ensure the child is up to date with the PCV (Pneumococcus) vaccine to prevent respiratory infections.",

        # --- NUTRITION & BREASTFEEDING ---
        "Exclusive breastfeeding is recommended for the first 6 months of a baby's life. No water or food is needed.",
        "After 6 months, start complementary feeding with enriched pap (containing groundnuts, fish, or eggs) while continuing breastfeeding.",
        "A child with very thin arms or a swollen belly may be suffering from malnutrition and needs 'Plumpy'Nut' or specialized care.",
        "Vitamin A supplements should be given to children every 6 months to boost immunity and prevent blindness.",
        "Pregnant women should take iron and folic acid supplements daily to prevent anemia and birth defects.",
        "Add diverse fruits and yellow vegetables (like papaya and carrots) to a child's diet for healthy growth.",
        "Wash all fruits and vegetables thoroughly with clean water before giving them to a child.",
        "Breastmilk is the first 'vaccine' for a baby, containing essential antibodies to fight infections.",
        "Avoid giving honey to infants under 12 months due to the risk of botulism.",
        "Ensure salt used in cooking is iodized to support the child's brain development.",

        # --- PREGNANCY & MATERNAL HEALTH ---
        "Pregnant women should attend at least four Antenatal Care (ANC) visits at a health facility.",
        "Danger signs in pregnancy: Vaginal bleeding, severe headache, blurry vision, or swelling of the face and hands.",
        "If a pregnant woman feels the baby stop moving, she must go to the hospital immediately.",
        "Tetanus toxoid injections are mandatory during pregnancy to protect both the mother and the newborn.",
        "Intermittent Preventive Treatment (IPTp) for Malaria is essential for pregnant women in Cameroon.",
        "A pregnant woman should eat one extra meal a day to support the growth of the baby.",
        "Sleep under a treated mosquito net throughout pregnancy to avoid malaria-related complications like miscarriage.",
        "Plan for a 'birth kit' (clean blade, soap, clean cloth) if you live far from a health center.",
        "Severe abdominal pain during pregnancy is not normal; consult a midwife or doctor immediately.",
        "Avoid taking any traditional herbs or medications during pregnancy without consulting a health professional.",

        # --- NEWBORN CARE & POSTNATAL ---
        "Keep the newborn's umbilical cord clean and dry. Do not apply oil, cow dung, or traditional herbs to it.",
        "Newborns should be kept skin-to-skin with the mother (Kangaroo Care) to maintain body warmth.",
        "Delayed crying at birth can lead to brain damage; ensure a skilled birth attendant is present.",
        "If a newborn's skin or eyes look very yellow (jaundice), take them to the clinic for evaluation.",
        "Postnatal care within 24 hours of delivery is critical for both the mother and the baby.",
        "If the mother has heavy bleeding after birth (soaking more than 2 pads an hour), it is a life-threatening emergency.",
        "The first thick yellow milk (colostrum) must be given to the baby as it is very high in nutrients.",
        "Keep the baby's environment warm and avoid bathing the baby in the first 24 hours after birth.",
        "Ensure the baby receives the BCG and Polio-0 vaccines immediately after birth.",
        "A newborn who is unable to suckle or has a weak cry needs urgent medical attention.",

        # --- IMMUNIZATION & PREVENTION ---
        "Follow the Cameroon EPI (Expanded Program on Immunization) schedule to protect children from 13 preventable diseases.",
        "Measles is highly contagious; ensure your child gets the measles vaccine at 9 months and 15 months.",
        "The Polio vaccine is essential to prevent permanent paralysis in children.",
        "Keep the child's vaccination card (Carnet de Vaccination) safe and bring it to every clinic visit.",
        "Routine deworming every 6 months prevents intestinal parasites that cause anemia and stunted growth.",
        "Handwashing with soap before preparing food and after using the latrine prevents 40% of childhood diseases.",
        "If a child has a skin rash with fever, it could be measles; keep them isolated and seek medical advice.",
        "Vaccines are provided for free in all public integrated health centers in Cameroon.",
        "Missing a vaccine date is okay, but you must go as soon as possible to complete the schedule.",
        "Tetanus can be fatal for newborns; ensure the mother is vaccinated during pregnancy.",

        # --- CAMEROON CONTEXT & PIDGIN/FRENCH NUANCES ---
        "In Cameroon, many childhood illnesses are caused by contaminated water; always boil water for the family.",
        "Traditional 'njangsa' or 'bush' medicine should not be substituted for clinical treatment for severe symptoms.",
        "Community Health Workers (CHWs) are available in many villages to provide basic first aid and RDT tests.",
        "If you see 'red eyes' in a newborn, it could be an infection; do not put breastmilk in the eyes, use clinic drops.",
        "Mothers should join 'Support Groups' or 'Moms Clubs' at the health center for shared learning.",
        "Cholera outbreaks are common in rainy seasons; report any case of 'rice-water' diarrhea immediately.",
        "Typhoid fever is spread through dirty food and water; ensure food is cooked thoroughly and served hot.",
        "Keep the child's finger nails short to prevent the spread of germs during eating.",
        "If a child is 'growing teeth', they may have mild irritability, but teeth-growing does not cause high fever.",
        "Visit the District Hospital (Hôpital de District) for any emergency that a local clinic cannot handle.",

        # --- ADDITIONAL SYMPTOMS ---
        "Ear discharge or the child pulling at their ear may indicate a middle ear infection.",
        "A stiff neck combined with high fever could be a sign of Meningitis, which is a medical emergency.",
        "Persistent crying in an infant (colic) can often be soothed by gentle rocking and burping after feeds.",
        "If a child has white patches in the mouth, it is likely oral thrush and needs antifungal drops.",
        "A child who is unusually quiet, not playing, or not interested in surroundings is likely quite ill.",
        "Scabies is a skin infection causing intense itching; all bedding and clothes must be washed in hot water.",
        "Hernias (swelling in the groin or belly button) that become hard and painful need immediate surgery.",
        "If a child swallows a small object (coin, battery), do not try to make them vomit; go to the hospital.",
        "Animal bites (dogs/cats) must be washed with soap for 15 minutes to prevent Rabies; visit the clinic.",
        "Burn injuries should be held under cool running water for 20 minutes. Do not apply butter or toothpaste.",
        "A child with a bloated face and legs might have Kwashiorkor (protein deficiency).",
        "Night blindness (inability to see in the dark) is an early sign of Vitamin A deficiency.",
        "If a child has a fast heart rate and is gasping for air, seek oxygen therapy immediately.",
        "Prevent worm infections by making sure children always wear shoes when playing outside in the dirt.",
        "Anemia signs: Pale palms, pale inside of eyelids, and constant tiredness.",
        "Ensure babies are tested for HIV at 6 weeks if the mother is HIV positive to start early treatment.",
        "Mothers living with HIV can safely breastfeed if they are strictly taking their ARV medications.",
        "Use a clean mosquito net even in the dry season to protect against various biting insects.",
        "Teach older children to wash their hands properly using the '7-step' technique with soap.",
        "Always keep medications, kerosene, and cleaning chemicals out of the reach of children."
    ]
}

# Python Server URL
URL = "http://127.0.0.1:8000/train"

print(f"Sending {len(health_knowledge['documents'])} medical documents to MamaCare AI...")

try:
    response = requests.post(URL, json=health_knowledge)
    if response.status_code == 200:
        print("\n✅ SUCCESS!")
        print(f"AI Response: {response.json().get('message')}")
        print(f"Total Vectors in DB: {response.json().get('vector_count')}")
    else:
        print("\n❌ ERROR!")
        print(response.text)
except Exception as e:
    print(f"\n❌ Connection Error: Is app.py running? ({e})")