from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

# Create your tests here.

#for account creation page, assert that a valid email is used

class RegisterViewTests(TestCase):
    def setUp(self):
        self.url = reverse("register")

    def _base_data(self, **overrides):
        data = {
            "username": "arin",
            "email": "arintr2@illinois.edu",
            "password": "Password123!",
            "password2": "Password123!",
        }
        data.update(overrides)
        return data

    
    def test_register_accepts_valid_email(self):
        data = self._base_data(email="arintrahman@gmail.com")
        response = self.client.post(self.url, data)

        # should be created successfully
        self.assertIn(response.status_code, (201, 302))
        self.assertTrue(User.objects.filter(email="arintrahman@gmail.com").exists())

    # invalid email
    def test_register_rejects_invalid_email_format(self):
        data = self._base_data(email="not-an-email")
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Enter a valid email address", str(response.json()))

    def test_register_accept_illinois_email(self):
        data = self._base_data(email="arintr2@illinois.edu")
        response = self.client.post(self.url, data)

        self.assertIn(response.status_code, (201, 302))
        self.assertTrue(User.objects.filter(email="arintr2@illinois.edu").exists())

    #for account creation page, assert that the ussername is 150 charactesr or fewer, 
    def test_register_reject_long_username(self):
        data = self._base_data(username="a" * 151)
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Ensure this field has no more than 150 characters", str(response.json()))

    # only uses letters, digits, @, ., +, -, _
    def test_register_rejects_invalid_username_characters(self):
        data = self._base_data(username="bad!name")

        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 400)
        # "Enter a valid username. This value may contain only letters,
        #  numbers, and @/./+/-/_ characters."
        self.assertIn("Enter a valid username", str(response.json()))

    #check for all forbidden characters
    def test_register_rejects_all_forbidden_username_characters(self):
        forbidden_chars = "!#$%^&*()={}[]|:;\"'<>,?/\\`~ "

        for char in forbidden_chars:
            bad_username = f"test{char}user"
            data = self._base_data(username=bad_username)

            response = self.client.post(self.url, data)

            self.assertEqual(
                response.status_code,
                400,
                msg=f"Username with forbidden char '{char}' should not be allowed"
            )
            self.assertIn("username", response.json())

    #for account creation page, assert that the password in the second field matches the first password field
    def test_register_reject_password_mismatch(self):
        data = self._base_data(password2="DifferentPassword123!")
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Passwords didn't match", str(response.json()))
