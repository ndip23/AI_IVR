import uuid
import random
from faker import Faker

fake = Faker()
regions = ["Littoral", "West", "Center", "South-West", "North-West"]
seasons = ["2022-A", "2023-A", "2024-A"]
status_types = ["PENDING", "DELIVERED", "DISPUTED"]

def generate_seed():
    # 1. Generate 500 Farmers
    with open('sample_data.sql', 'w') as f:
        f.write("-- NAIDLS Sample Data Population\n")
        
        for i in range(500):
            farmer_id = uuid.uuid4()
            f_name = fake.first_name()
            l_name = fake.last_name()
            nat_id = f"ID-{random.randint(100000, 999999)}"
            region = random.choice(regions)
            f.write(f"INSERT INTO core_farmer (id, national_id, first_name, last_name, region) "
                    f"VALUES ('{farmer_id}', '{nat_id}', '{f_name}', '{l_name}', '{region}');\n")

        # 2. Generate 20 Agro-Dealers
        for i in range(20):
            dealer_id = uuid.uuid4()
            company = fake.company() + " Agro"
            f.write(f"INSERT INTO core_agrodealer (id, company_name, is_verified) "
                    f"VALUES ('{dealer_id}', '{company}', True);\n")

        # 3. Generate 1,200 Allocations
        for i in range(1200):
            alloc_id = uuid.uuid4()
            status = random.choice(status_types)
            season = random.choice(seasons)
            f.write(f"INSERT INTO linkage_allocation (id, season_id, status, quantity) "
                    f"VALUES ('{alloc_id}', '{season}', '{status}', {random.uniform(50, 200):.2f});\n")

if __name__ == "__main__":
    generate_seed()
    print("Files seed_data.py and sample_data.sql generated successfully.")